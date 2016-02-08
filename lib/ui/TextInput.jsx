import React, { PropTypes } from "react";


export default class TextInput extends React.Component {
	static displayName = "TextInput";

	static propTypes = {
		style: PropTypes.object,
		size: PropTypes.number,
		// maxLength: PropTypes.number,
		value: PropTypes.string,
		multiLine: PropTypes.bool,
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
		size: null,
		// maxLength: null,
		value: NaN,
		multiLine: false,
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
		const { onChange } = this.props;
		if (onChange !== null) {
			onChange(event.target.value);
		}
	}

	onKeyUp(event) {
		const { onKeyUp, multiLine } = this.props;
		if (multiLine && event.keyCode === 13) {
			return;
		}
		if (onKeyUp !== null) {
			onKeyUp(event);
		}
	}

	renderInput() {
		if (this.props.multiLine) {
			return (
				<textarea
					style={this.props.style}
					ref="input"
					className={this.props.inputClass}
					value={this.props.value}
					label={this.props.label}
					placeholder={this.props.placeholder}
					disabled={this.props.disabled}
					onChange={this.onChange}
					onKeyUp={this.onKeyUp}
				/>
			);
		} else {
			return (
				<input
					style={this.props.style}
					ref="input"
					type="text"
					className={this.props.inputClass}
					value={this.props.value}
					label={this.props.label}
					placeholder={this.props.placeholder}
					size={this.props.size}
					disabled={this.props.disabled}
					onChange={this.onChange}
					onKeyUp={this.onKeyUp}
				/>
			);
		}
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
