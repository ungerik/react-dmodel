import React from "react";
import { Input } from "react-bootstrap";

export default class TextInput extends React.Component {
	static displayName = "TextInput";

	static propTypes = {
	};

	static defaultProps = {
	};

	constructor(...args) {
		super(...args);
		this.onChange = this.onChange.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}

	state = {
	};

	render() {
		return (
			<Input/>
		);
	}
}
