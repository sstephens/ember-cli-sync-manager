/**
 * @module service
 *
 */
import Service from '@ember/service';
import { get, set } from '@ember/object';
import { isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import mergeConfig from '@busybusy/sync-manager/utils/merge-config';
import webWorker from '@busybusy/sync-manager/utils/web-worker';

/**
 *
 */
export default Service.extend({
  start(options={}) {
    const opts = mergeConfig(options, get(this, 'config'));
    const owner = getOwner(this);
    const path = get(opts, 'db.path');
    const db = owner.factoryFor(path);

    assert(`sync-manager: database configuration was not found at ${path}`, db && db.class);

    let mergedDB = mergeConfig(get(opts, 'db'), db.class);
    set(opts, 'db', mergedDB);


    let worker = webWorker(opts);
    worker.on('message', value => handleMessage(this, value));
    set(this, 'worker', worker);
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
}
