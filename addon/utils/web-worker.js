/**
 * @module Utils
 *
 */
import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';


export default function webWorker(options={}) {
  const Listener = EmberObject.extend(Evented, {
    message(msg) { this.trigger('message', msg); }
  });

  const worker = new Worker('/workers/data-sync.js');
	const listener = Listener.create({ worker });

	worker.onmessage = function(event) {
		listener.message(event.data);
	};

	worker.postMessage([ options ]);

	return listener;
}
