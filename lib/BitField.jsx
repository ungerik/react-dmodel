import React from "react";
import DataType from "./DataType";


export default class BitField extends DataType {
	static displayName = "BitField";
	static dataModelType = "BitField";

	static propTypes = {
		name: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		label: null,
		style: {},
	};

	static validate(value, props) {
		return null;
	}
}
