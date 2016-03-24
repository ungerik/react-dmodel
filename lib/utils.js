export function asArray(element) {
	if (Array.isArray(element)) {
		return element;
	}
	if (element.props && element.props.children) {
		return asArray(element.props.children);
	} else {
		return [element];
	}
}


export function forEachChildElement(dataModel, callback) {
	if (Array.isArray(dataModel.props.children)) {
		for (const child of dataModel.props.children) {
			if (child) {
				const stop = callback(child);
				if (stop === true) {
					return true;
				}
			}
		}
		return false;
	} else {
		return dataModel.props.children ? callback(dataModel.props.children) : false;
	}
}


export function forEachChildElementRecursive(dataModel, callback) {
	return forEachChildElement(dataModel, child => {
		if (!child) {
			return false;
		}
		const stop = callback(child);
		if (stop === true) {
			return true;
		}
		return forEachChildElementRecursive(child, callback);
	});
}


export function findChildElement(dataModel, name) {
	let result = null;
	forEachChildElement(dataModel, element => {
		if (!element) {
			return false;
		}
		const found = element.props.name === name;
		result = element;
		return found;
	});
	return result;
}


export function childNames(dataModel) {
	const result = [];
	forEachChildElement(dataModel, element => {
		if (!element) {
			return;
		}
		const { props, type } = element;
		if (props === undefined) {
			return;
		}
		if (type.dataModelType && props.name) {
			result.push(props.name);
		} else if (props.children) {
			result.push(...childNames(element));
		}
	});
	return result;
}


export function getPropsAndValues(dataModel, data, callback) {
	const table = [];
	forEachChildElement(dataModel, element => {
		if (!element) {
			return;
		}
		const { props, type } = element;
		if (props === undefined) {
			return;
		}
		if (type.dataModelType && props.name) {
			let value;
			if (data.hasOwnProperty(props.name)) {
				value = data[props.name];
			} else {
				value = type.dynamicDefaultValue ? type.dynamicDefaultValue(props) : props.defaultValue;
			}
			callback(props, value);
		} else if (props.children) {
			getPropsAndValues(element, data, callback);
		}
	});
	return table;
}


export function assignData(dataModel, source, destination = {}) {
	forEachChildElement(dataModel, element => {
		if (!element) {
			return;
		}
		const { props, type } = element;
		if (props === undefined) {
			return;
		}
		if (type.dataModelType && props.name) {
			if (source.hasOwnProperty(props.name)) {
				destination[props.name] = source[props.name];
			} else {
				destination[props.name] = type.dynamicDefaultValue ? type.dynamicDefaultValue(props) : props.defaultValue;
			}
		} else if (props.children) {
			assignData(element, source, destination);
		}
	});
	return destination;
}


export function defaultData(dataModel) {
	return assignData(dataModel, {});
}


// Stolen from https://github.com/gaearon/react-pure-render/blob/master/src/shallowEqual.js
export default function shallowEqual(objA, objB) {
	if (objA === objB) {
		return true;
	}

	if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
		return false;
	}

	var keysA = Object.keys(objA);
	var keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
	for (var i = 0; i < keysA.length; i++) {
		if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
			return false;
		}
	}

	return true;
}
