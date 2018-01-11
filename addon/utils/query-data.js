
import dexie from 'dexie';

export default function queryData(info, type, cb) {
	const stores = info.stores || [];
	const db = new dexie(info.name);
  stores.forEach(_store => {
    db.version(_store.version).stores(_store.stores);
  });

	db.open().catch(e => {
		window.console.error('db open error', e);
	});

	db.transaction('rw', db[type], () => {
		cb(db[type]);
	});
}
