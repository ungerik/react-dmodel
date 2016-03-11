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
			callback({...props, value});
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
		if (type.dataModelType) {
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


export function shallowEqual(objA, objB) {
	if (objA === objB) {
		return true;
	}
	var key;
	// Test for A's keys different from B.
	for (key in objA) {
		if (objA.hasOwnProperty(key) && (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
			return false;
		}
	}
	// Test for B's keys missing from A.
	for (key in objB) {
		if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
			return false;
		}
	}
	return true;
}
