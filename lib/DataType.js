/*eslint react/display-name:0 react/prop-types:0*/

import React from "react";

export default class DataType extends React.Component {

	label() {
		return this.props.label || "dmodel.DataType";
	}

	noMappingError() {
		return `No data type mapping for "${this.label()}!` +
			` dmodel elements are not designed to be rendered directly, they have to be mapped to other element classes"`;
	}

	debugInfoAsTag() {
		const type = this.__proto__.constructor.displayName || this.__proto__.constructor.name;
		let args = "";
		for (const name of Object.keys(this.props)) {
			let value = this.props[name];
			switch (typeof value) {
			case "number":
			case "boolean":
				value = `{${value}}`;
				break;
			case "string":
			case "function":
				value = `"${value}"`;
				break;
			case "object":
				value = `{${JSON.stringify(value)}}`;
				break;
			default:
				value = `"${value}"`;
			}
			args += ` ${name}=${value}`;
		}
		return `<${type}${args} />`;
	}

	render() {
		return <span className="dmodelDataType">{this.debugInfoAsTag()}</span>;
	}
}
