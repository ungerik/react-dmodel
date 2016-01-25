import React from "react";

import DataType from "./DataType";
import { assignData, forEachChildElement } from "./utils";


export default class DataModel extends DataType {
	static displayName = "DataModel";
	static dataModelType = "DataModel";

	static propTypes = {
		children: React.PropTypes.node,
		data: React.PropTypes.object,
		mapFunc: React.PropTypes.func,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		style: {},
	};

	constructor(props, ...args) {
		super(props, ...args);
		this.getValue = this.getValue.bind(this);
		this.setValue = this.setValue.bind(this);
		if (props.data) {
			this.state = assignData(this, props.data);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data) {
			this.setState(assignData(this, nextProps.data));
		}
	}

	validate() {
		let error = null;
		forEachChildElement(this, ({ type, props }) => {
			if (type && typeof type.validate === "function") {
				error = type.validate(this.getValue(props.name), props);
			}
			return !!error;
		});
		return error;
	}

	getValue(name) {
		return this.state[name];
	}

	setValue(name, value) {
		this.setState({[name]: value});
	}

	onRef() {
	}

	onKeyUp() {
	}

	render() {
		const element = <DataModel {...this.props}>{this.props.children}</DataModel>;
		return this.props.mapFunc(element, this.getValue, this.setValue, {onKeyUp: event => this.onKeyUp(event)}, [], ref => this.onRef(ref));
	}

}
