import React, { PropTypes } from "react";
import dmodelPropTypes from "../PropTypes";


function fixDecimals(s, decimals) {
	const p = s.indexOf(".");
	if (p === -1) {
		return s;
	}

	return s.substr(0, p + decimals + 1);
}


function fixFloatString(s, decimals) {
	if (s.length === 0) {
		return s;
	}

	// Remove all non valid number characters
	s = s.replace(/[^\-\.\,\d]/g, "");

	// Replace comma with point
	s = s.replace(/[\,]/g, ".");

	// Remove all but leading "-"
	s = s.substring(0, 1) + s.substring(1).replace(/\-/g, "");

	// Remove all but first "."
	let p = s.indexOf(".");
	if (p !== -1) {
		p++;
		s = s.substring(0, p) + s.substring(p).replace(/\./g, "");
	}

	// Remove extra decimal digits
	return fixDecimals(s, decimals);
}


function ftoa(f, decimals, emptyValue) {
	if (f === emptyValue || !Number.isFinite(f)) {
		return "";
	}
	return fixDecimals(`${f}`, decimals);
}


function atof(a, decimals, emptyValue) {
	return a.length === 0 ? emptyValue : parseFloat(fixFloatString(a, decimals));
}


export default class FloatInput extends React.Component {
	static displayName = "FloatInput";

	static propTypes = {
		style: PropTypes.object,
		size: PropTypes.number,
		value: dmodelPropTypes.numberOrNull,
		emptyValue: PropTypes.any,
		min: PropTypes.number,
		max: PropTypes.number,
		decimals: PropTypes.number,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		disabled: PropTypes.bool,
		wrapperClass: PropTypes.string,
		labelClass: PropTypes.string,
		inputClass: PropTypes.string,
		onChange: PropTypes.func,
		onKeyUp: PropTypes.func,
	};

	static defaultProps = {
		style: null,
		size: null,
		value: null,
		emptyValue: null,
		min: -Number.MAX_VALUE,
		max: +Number.MAX_VALUE,
		decimals: 3,
		label: null,
		placeholder: null,
		disabled: false,
		onChange: null,
		onKeyUp: null,
		wrapperClass: null,
		labelClass: null,
		inputClass: null,
	};

	trailingPoint = false;
	trailingZeros = 0;

	constructor(...args) {
		super(...args);
		this.onChange = this.onChange.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}

	onChange(event) {
		const { min, max, decimals, onChange } = this.props;

		const s = event.target.value;
		const p = s.lastIndexOf(".");
		if (p === -1) {
			this.trailingPoint = false;
			this.trailingZeros = 0;
		} else {
			this.trailingZeros = 0;
			for (let i = s.length - 1; i > p && s[i] === "0"; i--) {
				this.trailingZeros++;
			}
			this.trailingPoint = s.length - 1 - this.trailingZeros === p;
		}

		let value = atof(s, decimals);
		if (value > max || value < min) {
			// If new value is outside of min max range
			// ignore the input and use old value:
			value = this.props.value;
			// Just to make sure in case the old value was outside of range:
			value = Math.min(max, value);
			value = Math.max(min, value);
		}

		if (onChange) {
			onChange(value);
		}
	}

	onKeyUp(event) {
		const { onKeyUp } = this.props;
		if (onKeyUp !== null) {
			onKeyUp(event);
		}
	}

	renderInput() {
		const { decimals, emptyValue } = this.props;

		let value = ftoa(this.props.value, decimals, emptyValue);
		if (this.trailingPoint) {
			value += ".";
		}
		for (let i = 0; i < this.trailingZeros; i++) {
			value += "0";
		}
		value = fixDecimals(value, decimals);
		// if (this.props.maxLength && value.length > this.props.maxLength) {
		// 	value = value.substring(0, this.props.maxLength);
		// }
		return (
			<input
				style={this.props.style}
				ref="input"
				type="number"
				className={this.props.inputClass}
				size={this.props.size}
				value={value}
				min={this.props.min}
				max={this.props.max}
				step={Math.pow(10, -decimals)}
				label={this.props.label}
				placeholder={this.props.placeholder}
				inputMode="numeric"
				pattern="[\-\d\.]*"
				title="Input must be a valid floating-point number"
				disabled={this.props.disabled}
				onChange={this.onChange}
				onKeyUp={this.onKeyUp}
			/>
		);
	}

	render() {
		if (this.props.label) {
			return (
				<div className={this.props.wrapperClass}>
					<label className={this.props.labelClass}>{this.props.label}</label>
					{this.renderInput()}
				</div>
			);
		} else {
			return this.renderInput();
		}
	}
}
