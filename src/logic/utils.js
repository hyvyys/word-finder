export function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)]
}

export function escapeRegExp(string) {
	return string.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
import XRegExp from "xregexp";

export function isRegExpValid(string) {
	var isValid = true;
	try {
		new RegExp(string);
	} catch (e) {
		isValid = false;
	}
	return isValid;
}

const GREEK_REGEXP = XRegExp('\\p{InGreek and Coptic}');

export function capitalize(w) {
	if (w.length > 1 && (
		GREEK_REGEXP.test(w[0]) && !GREEK_REGEXP.test(w[1])
	))
		return (w)
	else
		return w[0].toUpperCase() + w.substr(1);
}

export function* idGenerator() {
	var index = 0;
	while (true)
		yield index++;
}

/**
 * Transforms an array of objects into an object.
 * @param {Array} array Array to transform.
 * @param {String} keyField Element's field to use as key in the target object.
 * @param {String} valueField Element's field to assign as value in the target object.
 */
export function objectFromArray(array, keyField, valueField) {
	const object = array.reduce((obj, element) => {
		obj[element[keyField]] = element[valueField];
		return obj;
	}, {});
	return object;
}

/**
 * Transforms an object into array of elements.
 * @param {Object} object Object to transform.
 * @param {String} keyField 
 * @param {String} valueField
 */
export function arrayFromObject(object, keyField, valueField) {
	const array = [];
	for (let key in Object.keys(object)) {
		array.push({ [keyField]: key, [valueField]: object[key] });
	}
	return array;
}

export function arrayElementsDiffer(a, b) {
	const A = a.slice();
	for (let element of b) {
		const index = A.indexOf(element);
		if (index == -1)
			return true;
		else
			A.splice(index, 1);
	}
	return a.length > 0;
}