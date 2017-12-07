/**
 * @module Utils
 *
 */
import { get, set } from '@ember/object';
import { merge } from '@ember/polyfills';
import { isNone } from '@ember/utils';
import { assert } from '@ember/debug';

/**
 * Merge settings from default config and app config
 *
 * @method mergeConfig
 * @params config {object}
 * @params defaultConfig {object}
 * @return {object}
 */
export default function mergeConfig(config={}, defaultConfig={}) {
  let result = {};

  let keys = Object.keys(defaultConfig);
  if (!keys.length) {
    return merge(result, config);
  }

  keys.forEach(key => {
    let item = get(config, key);
    let defaultItem = get(defaultConfig, key);
    if (isNone(item)) {
      set(result, key, defaultItem);
    } else if (typeof item === 'object') {
      assert(`sync_manager config setting ${key} must not be type of object`, typeof defaultItem === 'object');
      set(result, key, mergeConfig(item, defaultItem));
    } else {
      assert(`sync_manager config setting ${key} must be type of object`, typeof defaultItem !== 'object');
      set(result, key, item);
    }
  });
  return result;
}
