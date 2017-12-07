import Mixin from '@ember/object/mixin';
import { inject } from '@ember/service';
import { get } from '@ember/object';

export default Mixin.create({
  syncManager: inject(),

  startSync(options) {
    get(this, 'syncManager').start(options);
  },

  stopSync() {
    get(this, 'syncManager').stop();
  }
});
