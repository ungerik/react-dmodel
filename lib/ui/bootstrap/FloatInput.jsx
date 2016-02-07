import React, { PropTypes } from "react";
import BaseFloatInput from "../FloatInput";


export default class FloatInput extends BaseFloatInput {
	static displayName = "FloatInput";

	static propTypes = {
		...BaseFloatInput.propTypes,
		addonAfter: PropTypes.string,
		bsStyle: PropTypes.oneOf(["success", "warning", "error"]),
	};

	static defaultProps = {
		...BaseFloatInput.defaultProps,
		wrapperClass: "form-group",
		labelClass: "control-label",
		inputClass: "form-control",
		addonAfter: null,
		bsStyle: null,
	};

	render() {
		const { label, addonAfter, bsStyle } = this.props;
		let groupClass = this.props.wrapperClass;
		if (bsStyle) {
			groupClass += " has-" + bsStyle;
		}
		return (
			<div className={groupClass}>
				{label ? <label className={this.props.labelClass}>{label}</label> : null}
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
