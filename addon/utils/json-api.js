/**
 * @module Utils
 *
 */
import { underscore } from '@ember/string';

export function toJsonApi(type, id, attrs={}, relationships={}) {
	const data = {
		type, id,
		attributes: {},
		relationships
	};

	Object.keys(attrs).forEach(key => {
		let val = attrs[key];
		let normalizedKey = underscore(key);
		data.attributes[normalizedKey] = val;
	});

	return data
}

export function toJsonApiArray(type, primaryKey, json) {
	let data = [];
	json.forEach(item => {
		if (item[primaryKey] !== null) {
			data.push(toJsonApi(type, item[primaryKey], item));
		}
	});
	return { data };
}
