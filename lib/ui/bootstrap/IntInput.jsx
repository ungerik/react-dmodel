import React, { PropTypes } from "react";
import BaseIntInput from "../IntInput";


export default class IntInput extends BaseIntInput {
	static displayName = "IntInput";

	static propTypes = {
		value: PropTypes.number,
		min: PropTypes.number,
		max: PropTypes.number,
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
		value: NaN,
		min: 0,
		max: Number.MAX_SAFE_INTEGER,
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
