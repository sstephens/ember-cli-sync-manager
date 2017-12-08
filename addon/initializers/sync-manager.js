/**
 * @module Initializers
 *
 */
import { get } from '@ember/object';
import mergeConfig from '@busybusy/sync-manager/utils/merge-config';

/***/
const DEFAULTS = {
  debug: false,
  db: { path: 'database:application' },
  api: { host: 'localhost:4200', version: '1', headers: {} },
  auth: {}
};

/**
 *
 */
export function initialize(app) {
  let config = mergeConfig(get(app, 'sync_manager'), DEFAULTS);
  app.register('config:sync-manager', config, { instantiate: false });
  app.inject('service:sync-manager', 'config', 'config:sync-manager');
  app.inject('route:application', 'syncManager', 'service:sync-manager');
}


export default {
  initialize
};
