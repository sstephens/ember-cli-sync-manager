/* eslint-env node */
'use strict';
const mergeTrees = require('broccoli-merge-trees');
const defaults = require('lodash.defaults');
const funnel = require('broccoli-funnel');
const path = require('path');

module.exports = {
  name: '@busybusy/sync-manager',

  included() {
    this._super.included.apply(this, arguments);
    this._options = this.getOptions();
    //this.importDependencies();
  },

  treeForPublic() {
    let hasFastBoot = this.project.addons.some(addon => addon.name === 'ember-cli-fastboot');
    let publicTree = this._super.treeForPublic.apply(this, arguments);
    let options = this._options;
    let trees = [];

    if (publicTree && hasFastBoot) {
      trees.push(publicTree);
    }

    let worker = funnel(options.workerPath, {
      srcDir: './',
      destDir: 'workers',
      include: ['data-sync.js']
    });
    trees.push(worker);
    return mergeTrees(trees);
  },

  getOptions() {
    let projectConfig = this.project.config(process.env.EMBER_ENV);
    let config = defaults(projectConfig, {});
    config.workerPath = path.dirname(require.resolve('@busybusy/data-sync-web-worker'));
    return config;
  }
};
