
import dexie from 'dexie';

export default function queryData(info, type, cb) {
	const stores = info.stores || {};
	stores.__sync = 'id';

	const db = new dexie(info.name);
	db.version(info.version).stores(info.stores);

	db.open().catch(e => {
		window.console.error('db open error', e);
	});

	db.transaction('rw', db[type], () => {
		cb(db[type]);
	});
}
