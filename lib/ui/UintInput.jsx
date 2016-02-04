import React, { PropTypes } from "react";


function itoa(i) {
	return isNaN(i) ? "" : `${Math.max(Math.floor(i), 0)}`;
}


function atoi(a) {
	const i = parseInt(a);
	return isNaN(i) ? i : Math.max(0, i);
}


export default class UintInput extends React.Component {
	static displayName = "UintInput";

	static propTypes = {
		size: PropTypes.number,
		// maxLength: PropTypes.number,
		value: PropTypes.number,
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
		size: null,
		// maxLength: null,
		value: NaN,
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
		if (this.props.onChange) {
			this.props.onChange(atoi(event.target.value));
		}
	}

	onKeyUp(event) {
		if (this.props.onKeyUp !== null) {
			this.props.onKeyUp(event);
		}
	}

	renderInput() {
		return (
			<input
				ref="input"
				type="number"
				className={this.props.inputClass}
				value={itoa(this.props.value)}
				label={this.props.label}
				placeholder={this.props.placeholder}
				size={this.props.size}
				min={Math.max(this.props.min, 0)}
				max={Math.max(this.props.max, 0)}
				inputMode="numeric"
				pattern="[0-9]*"
				title={`Input must be a non-negative integral number from ${this.props.min} to ${this.props.max}`}
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
