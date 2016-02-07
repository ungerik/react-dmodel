import React from "react";

// Stolen from React 0.14.3
function createChainableTypeChecker(validate) {
	function checkType(isRequired, props, propName, componentName, location, propFullName) {
		componentName = componentName || "ANONYMOUS";
		propFullName = propFullName || propName;
		if (props[propName] == null) {
			var locationName = ""; //ReactPropTypeLocationNames[location];
			if (isRequired) {
				return new Error("Required " + locationName + " `" + propFullName + "` was not specified in " + ("`" + componentName + "`."));
			}
			return null;
		} else {
			return validate(props, propName, componentName, location, propFullName);
		}
	}

	var chainedCheckType = checkType.bind(null, false);
	chainedCheckType.isRequired = checkType.bind(null, true);

	return chainedCheckType;
}


function validNumber(props, propName, componentName, location, propFullName) {
	const err = React.PropTypes.number(props, propName, componentName, location, propFullName);
	if (err) {
		return err;
	}
	if (isNaN(props[propName])) {
		propFullName = propFullName || propName;
		return new Error(`Prop ${componentName}.${propFullName} is not a number (NaN)`);
	}
	return null;
}


function numberOrNull(props, propName, componentName, location, propFullName) {
	if (props[propName] === null) {
		return null;
	}
	return React.PropTypes.number(props, propName, componentName, location, propFullName);
}


function uint(props, propName, componentName, location, propFullName) {
	const err = React.PropTypes.number(props, propName, componentName, location, propFullName);
	if (err) {
		return err;
	}
	const value = props[propName];
	if (!Number.isInteger(value) || value < 0) {
		propFullName = propFullName || propName;
		return new Error(`Prop ${componentName}.${propFullName} must be an unsigned integer, but is ${value}`);
	}
	return null;
}


function minMax(props, propName, componentName, location, propFullName) {
	const err = validNumber(props, propName, componentName, location, propFullName);
	if (err) {
		return err;
	}
	if (props.min > props.max) {
		return new RangeError(`${componentName}.min of ${props.min} is greater than ${componentName}.max of ${props.max}`);
	}
	return null;
}


const exports = {
	validNumber: createChainableTypeChecker(validNumber),
	numberOrNull: createChainableTypeChecker(numberOrNull),
	uint: createChainableTypeChecker(uint),
	minMax,
};

export default exports;
