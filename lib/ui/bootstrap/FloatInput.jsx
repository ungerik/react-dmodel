import React, { PropTypes } from "react";
import BaseFloatInput from "../FloatInput";


export default class FloatInput extends BaseFloatInput {
	static displayName = "FloatInput";

	static propTypes = {
		...BaseFloatInput.propTypes,
		addonAfter: PropTypes.string,
		bsStyle: PropTypes.oneOf(["success", "warning", "error"]),
		required: React.PropTypes.bool,
	};

	static defaultProps = {
		...BaseFloatInput.defaultProps,
		wrapperClass: "form-group",
		labelClass: "control-label",
		inputClass: "form-control",
		addonAfter: null,
		bsStyle: null,
		required: false,
	};

	render() {
		const value = this.valueForInput();

		const { label, addonAfter, bsStyle, required } = this.props;
		let groupClass = this.props.wrapperClass;
		if (bsStyle) {
			groupClass += " has-" + bsStyle;
		} else if (required) {
			groupClass += value.length !== 0 ? " has-success" : " has-error";
		}
		return (
			<div className={groupClass}>
				{label ? <label className={this.props.labelClass}>{label}</label> : null}
				{addonAfter ?
					<div className="input-group">
						{this.renderInput(value)}
						<span className="input-group-addon">{addonAfter}</span>
					</div>
				:
					this.renderInput(value)
				}
			</div>
		);
	}
}
