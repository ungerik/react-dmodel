import React, { PropTypes } from "react";


function itoa(i) {
	return isNaN(i) ? "" : `${Math.floor(i)}`;
}


function atoi(a) {
	return parseInt(a);
}


export default class IntInput extends React.Component {
	static displayName = "IntInput";

	static propTypes = {
		value: PropTypes.number,
		min: PropTypes.number,
		max: PropTypes.number,
		label: PropTypes.string,
		addonAfter: PropTypes.string,
		bsStyle: PropTypes.oneOf(["success", "warning", "error"]),
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		inputClass: PropTypes.string,
		labelClass: PropTypes.string,
		wrapperClass: PropTypes.string,
	};

	static defaultProps = {
		value: NaN,
		min: 0,
		max: Number.MAX_SAFE_INTEGER,
		label: null,
		addonAfter: null,
		bsStyle: null,
		disabled: false,
		onChange: null,
		inputClass: null,
		labelClass: null,
		wrapperClass: null,
	};

	onChange(event) {
		// TODO: handle value not in range of min max. Neets temporary state
		if (this.props.onChange) {
			this.props.onChange(atoi(event.target.value));
		}
	}

	renderInput() {
		return (
			<input
				className={this.props.inputClass}
				type="number"
				value={itoa(this.props.value)}
				label={this.props.label}
				min={this.props.min}
				max={this.props.max}
				inputMode="numeric"
				pattern="[\-\d]*"
				title={`Input must be a non-negative integral number from ${this.props.min} to ${this.props.max}`}
				disabled={this.props.disabled}
				onChange={(event) => this.onChange(event)}
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
