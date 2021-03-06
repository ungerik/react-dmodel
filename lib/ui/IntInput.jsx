import React, { PropTypes } from "react";
import dmodelPropTypes from "../PropTypes";


function itoa(i, emptyValue) {
	return Number.isInteger(i) && i !== emptyValue ? i : "";
}


function atoi(a, emptyValue) {
	const i = parseInt(a);
	return Number.isInteger(i) ? i : emptyValue;
}


export default class IntInput extends React.Component {
	static displayName = "IntInput";

	static propTypes = {
		style: PropTypes.object,
		size: PropTypes.number,
		value: dmodelPropTypes.numberOrNull,
		emptyValue: PropTypes.any,
		min: PropTypes.number,
		max: PropTypes.number,
		label: PropTypes.string,
		placeholder: PropTypes.string,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		onKeyUp: PropTypes.func,
		inputClass: PropTypes.string,
		labelClass: PropTypes.string,
		wrapperClass: PropTypes.string,
	};

	static defaultProps = {
		style: null,
		value: null,
		emptyValue: null,
		min: 0,
		max: Number.MAX_SAFE_INTEGER,
		label: null,
		placeholder: null,
		disabled: false,
		onChange: null,
		onKeyUp: null,
		inputClass: null,
		labelClass: null,
		wrapperClass: null,
	};

	constructor(...args) {
		super(...args);
		this.onChange = this.onChange.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}

	onChange(event) {
		// TODO: handle value not in range of min max. Neets temporary state
		const { onChange } = this.props;
		if (onChange) {
			const value = atoi(event.target.value, this.props.emptyValue);
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
		const { min, max } = this.props;
		const value = itoa(this.props.value, this.props.emptyValue);
		return (
			<input
				style={this.props.style}
				ref="input"
				type="number"
				className={this.props.inputClass}
				value={value}
				label={this.props.label}
				placeholder={this.props.placeholder}
				size={this.props.size}
				min={min}
				max={max}
				inputMode="numeric"
				pattern="[\-\d]*"
				title={`Input must be a non-negative integral number from ${min} to ${max}`}
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
