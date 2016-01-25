import React, { PropTypes } from "react";
import BaseUintInput from "../UintInput";


export default class UintInput extends BaseUintInput {
	static displayName = "UintInput";

	static propTypes = {
		size: PropTypes.number,
		// maxLength: PropTypes.number,
		value: PropTypes.number,
		min: PropTypes.number,
		max: PropTypes.number,
		label: PropTypes.string,
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
		min: 0,
		max: Number.MAX_SAFE_INTEGER,
		label: null,
		addonAfter: null,
		bsStyle: null,
		disabled: false,
		onChange: null,
		onKeyUp: null,
		inputClass: "form-control",
	};

	render() {
		const groupClass = "form-group" + (this.props.bsStyle ? " has-" + this.props.bsStyle : "");
		const { label, addonAfter } = this.props;
		return (
			<div className={groupClass}>
				{label ? <label className="control-label">{label}</label> : null}
				<div className="input-group">
					{super.renderInput()}
					{addonAfter ? <span className="input-group-addon">{addonAfter}</span> : null}
				</div>
			</div>
		);
	}
}
