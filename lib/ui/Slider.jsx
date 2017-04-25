import React from "react";
import ReactDOM from "react-dom";
import interact from "interact.js";

import dmodelPropTypes from "../PropTypes";


export default class Slider extends React.PureComponent {
	static displayName = "Slider";

	static propTypes = {
		width: dmodelPropTypes.validNumber.isRequired,
		height: dmodelPropTypes.validNumber,
		min: dmodelPropTypes.minMax,
		max: dmodelPropTypes.minMax,
		value: React.PropTypes.number,
		integer: React.PropTypes.bool,
		ticks: React.PropTypes.bool,
		tickSpacing: dmodelPropTypes.validNumber,
		snapToTicks: React.PropTypes.bool,
		tickLabels: React.PropTypes.bool,
		labelFont: React.PropTypes.string,
		labelSize: dmodelPropTypes.validNumber,
		labelDecimals: React.PropTypes.number,
		unit: React.PropTypes.string,
		sliderColor: React.PropTypes.string,
		backgroundColor: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onDragStart: React.PropTypes.func,
		onDragMove: React.PropTypes.func,
		onDragStop: React.PropTypes.func,
		fixed: React.PropTypes.bool,
	};

	static defaultProps = {
		height: 32,
		min: 0,
		max: 100,
		value: 0,
		integer: false,
		ticks: true,
		tickSpacing: 10,
		snapToTicks: false,
		tickLabels: true,
		labelFont: `"Helvetica Neue", Helvetica, Arial, sans-serif`,
		labelSize: 20,
		labelDecimals: NaN,
		unit: "",
		sliderColor: "#337ab7",
		backgroundColor: "#F0F0F0",
		onChange: null,
		onDragStart: null,
		onDragMove: null,
		onDragStop: null,
		fixed: false,
	};

	valueFromDragEvent(event) {
		const { width, height, min, max, value, integer, tickSpacing, snapToTicks } = this.props;
		const sliderWidth = height * 0.5;
		const slidingWidth = width - sliderWidth;
		const dx = event.clientX - event.clientX0;
		const lastValue = isNaN(value) ? min : value;
		let newValue = lastValue + dx / slidingWidth * (max - min);
		if (snapToTicks) {
			newValue = Math.round((newValue - min) / tickSpacing) * tickSpacing + min;
		} else if (integer) {
			newValue = Math.round(newValue);
		}
		newValue = Math.min(max, newValue);
		newValue = Math.max(min, newValue);
		return newValue;
	}

	componentDidMount() {
		if (this.props.fixed) {
			return;
		}

		const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
		const slider = ReactDOM.findDOMNode(this.refs.slider);
		interact(slider)
			.draggable({
				startAxis: "x",
				lockAxis: "x",
				preventDefault: "always",
				restrict: {
					restriction: wrapper,
					elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
				}
			})
			.on("dragstart", event => {
				event.preventDefault();
				if (this.props.onDragStart) {
					this.props.onDragStart(this.props.value);
				}
			})
			.on("dragmove", event => {
				const dx = event.clientX - event.clientX0;
				slider.style.transform = `translateX(${dx}px)`;
				if (this.props.onDragMove) {
					this.props.onDragMove(this.valueFromDragEvent(event));
				}
			})
			.on("dragend", event => {
				slider.style.transform = "";

				const newValue = this.valueFromDragEvent(event);

				if (this.props.onDragStop) {
					this.props.onDragStop(newValue);
				}
				if (this.props.onChange) {
					this.props.onChange(newValue);
				}
			});
	}

	render() {
		const { width, height, min, max, value, ticks, tickSpacing, tickLabels, labelFont, labelSize, labelDecimals, unit, sliderColor, backgroundColor } = this.props;

		const sliderWidth = height * 0.5;
		const halfSliderWidth = sliderWidth * 0.5;
		const halfSliderHeight = height * 0.5;

		let totalHeight = height;
		if (tickLabels) {
			totalHeight += labelSize;
		}

		const slidingWidth = width - sliderWidth;

		function valueToX(v) {
			return (v - min) / (max - min) * slidingWidth;
		}

		const sliderX = isNaN(value) ? 0 : valueToX(value);

		const tickHeight = labelSize * 0.2;
		const tickMargin = labelSize * 0.1;
		const fontSize = labelSize * 0.7;

		const shaftStyle = {
			width: sliderWidth,
			height: halfSliderHeight,
			backgroundColor: sliderColor,
		};

		const arrowStyle = {
			width: 0,
			height: 0,
			borderTop: `${halfSliderHeight}px solid ${sliderColor}`,
			borderLeft: `${halfSliderWidth}px solid transparent`,
			borderRight: `${halfSliderWidth}px solid transparent`,
		};

		const labelWrapperStyle = {
			position: "absolute",
			zIndex: 1,
			top: 0,
			height: fontSize,
			fontFamily: labelFont,
			fontSize: fontSize,
			lineHeight: `${fontSize}px`,
			textAlign: "center",
		};

		const tickStyle = {
			width: 0,
			height: tickHeight,
			borderLeft: "1px solid black",
			borderRight: "1px solid black",
			margin: `0 auto ${tickMargin}px`,
		};

		let labels = null;
		if (ticks) {
			labels = [];
			const width = slidingWidth / ((max - min) / tickSpacing);
			for (let v = min; v <= max; v += tickSpacing) {
				const left = halfSliderWidth - width * 0.5 + valueToX(v);
				if (isFinite(labelDecimals)) {
					v = v.toFixed(labelDecimals);
				}
				const div = (
					<div key={"val" + v} style={{...labelWrapperStyle, left, width}}>
						<div style={tickStyle}></div>
						<div>{v}{unit}</div>
					</div>
				);
				labels.push(div);
			}
		}

		const sliderBackgroundStyle = {
			position: "relative",
			width: slidingWidth,
			height,
			left: halfSliderWidth,
			backgroundColor,
		}

		const sliderStyle = {
			position: "absolute",
			zIndex: 1,
			top: 0,
			left: sliderX,
			height,
			cursor: "col-resize",
			touchAction: "none",
		}

		return (
			<div ref="wrapper" className="dmodel-slider-wrapper" style={{position: "relative", width, height: totalHeight, touchAction: "none"}}>
				<div className="dmodel-slider-background" style={sliderBackgroundStyle}></div>
				<div ref="slider" className="dmodel-slider" style={sliderStyle}>
					<div style={shaftStyle}></div>
					<div style={arrowStyle}></div>
				</div>
				{labels ? <div className="dmodel-slider-labels" style={{position: "relative", width, height: labelSize}}>{labels}</div> : null}
			</div>
		);
	}
}
