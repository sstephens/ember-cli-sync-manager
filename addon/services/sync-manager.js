/**
 * @module service
 *
 */
import Service, { inject } from '@ember/service';
import { get, set } from '@ember/object';
import { isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import mergeConfig from '@busybusy/sync-manager/utils/merge-config';
import webWorker from '@busybusy/sync-manager/utils/web-worker';
import queryData from '@busybusy/sync-manager/utils/query-data';
import { toJsonApiArray } from '@busybusy/sync-manager/utils/json-api';

/**
 *
 */
export default Service.extend({
  store: inject(),

  start(options={}) {
    const opts = mergeConfig(options, get(this, 'config'));
    const owner = getOwner(this);
    const path = get(opts, 'db.path');
    const db = mergeConfig({}, get(opts, 'db'));
    const stores = [];

    let _store = 1;
    let ver = 1;
    while(_store) {
      _store = owner.factoryFor(`${path}:v${ver}`);
      if (_store && _store.class) {
        _store = get(_store, 'class');
        set(_store, 'version', ver);
        stores.unshift(_store);
      }
      ver += 1;
    }

    console.log('stores', stores);
    assert(`sync-manager: database configuration was not found at ${path}`, stores.length > 0);

    set(db, 'stores', stores);
    set(opts, 'db', db);
    set(this, 'dbInfo', db);


    let worker = webWorker(opts);
    worker.on('message', value => {
      handleMessage(this, value);
    });
    set(this, 'worker', worker);
  },

  updateStore(type) {
    queryData(get(this, 'dbInfo'), type, cursor => {
      cursor.toArray().then(data => {
        let models = toJsonApiArray(type, 'id', data);
        console.log('updateStore', data, models);
        this.get('store').pushPayload(models);
      });
    });
  },

  stop() {
    let worker = get(this, 'worker');
    if (!isNone(worker)) {
      worker.terminate();
    }
  }
});

function handleMessage(target, message) {
  window.console.log('sync-manager received new message', message);
  if (message.status === 'sync') {
    target.updateStore(message.model);
  }
}
