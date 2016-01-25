import React, { PropTypes } from "react";
import BaseFloatInput from "../FloatInput";


export default class FloatInput extends BaseFloatInput {
	static displayName = "FloatInput";

	static propTypes = {
		size: PropTypes.number,
		// maxLength: PropTypes.number,
		value: PropTypes.number,
		min: PropTypes.number,
		max: PropTypes.number,
		decimals: PropTypes.number,
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
		min: -Number.MAX_VALUE,
		max: +Number.MAX_VALUE,
		decimals: 3,
		label: null,
		addonAfter: null,
		bsStyle: null,
		disabled: false,
		onChange: null,
		onKeyUp: null,
		inputClass: "form-control",
	};

	render() {
		const { label, addonAfter } = this.props;
		const groupClass = "form-group" + (this.props.bsStyle ? " has-" + this.props.bsStyle : "");
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
