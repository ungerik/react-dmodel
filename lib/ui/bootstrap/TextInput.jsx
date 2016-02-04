import React, { PropTypes } from "react";
import BaseTextInput from "../TextInput";


export default class TextInput extends BaseTextInput {
	static displayName = "TextInput";

	static propTypes = {
		size: PropTypes.number,
		// maxLength: PropTypes.number,
		value: PropTypes.number,
		multiLine: PropTypes.bool,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		addonAfter: PropTypes.string,
		bsStyle: PropTypes.oneOf(["success", "warning", "error"]),
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		onKeyUp: PropTypes.func,
		inputClass: PropTypes.string,
	};

	static defaultProps = {
		size: null,
		// maxLength: null,
		value: NaN,
		multiLine: PropTypes.bool,
		label: null,
		placeholder: null,
		addonAfter: null,
		bsStyle: null,
		disabled: false,
		onChange: null,
		onKeyUp: null,
		inputClass: "form-control",
	};

	render() {
		let groupClass = "form-group";
		if (this.props.bsStyle) {
			groupClass += " has-" + this.props.bsStyle;
		}
		const { label, addonAfter } = this.props;
		return (
			<div className={groupClass}>
				{label ? <label className="control-label">{label}</label> : null}
				{addonAfter ?
					<div className="input-group">
						{super.renderInput()}
						<span className="input-group-addon">{addonAfter}</span>
					</div>
				:
					super.renderInput()
				}
			</div>
		);
	}
}
