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


export function assignData(dataModel, source, destination = {}) {
	forEachChildElement(dataModel, element => {
		if (!element) {
			return;
		}
		const props = element.props;
		if (props === undefined) {
			return;
		}
		if (props.hasOwnProperty("children")) {
			assignData(element, source, destination);
		} else if (element.type.dataModelType) {
			destination[props.name] = source.hasOwnProperty(props.name) ? source[props.name] : props.defaultValue;
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
