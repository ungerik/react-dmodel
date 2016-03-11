import React from "react";
import ReactDOM from "react-dom";
import interact from "interact";

import dmodelPropTypes from "../PropTypes";


export default class Slider extends React.Component {
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
		fixed: false,
	};

	state = {
		dragging: false,
		dragValue: 0,
	}

	componentDidMount() {
		if (this.props.fixed) {
			return;
		}

		const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
		const slider = ReactDOM.findDOMNode(this.refs.slider);
		interact(slider)
			.draggable({
				restrict: {
					restriction: wrapper,
					elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
				}
			})
			// .on("dragstart", () => {
			// 	console.log("dragstart");
			// })
			.on("dragmove", event => {
				const dx = event.clientX - event.clientX0;
				// console.log("dx", dx);
				slider.style.transform = `translateX(${dx}px)`;
			})
			.on("dragend", event => {
				slider.style.transform = "";
				const { width, height, min, max, value, integer, tickSpacing, snapToTicks, onChange } = this.props;
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
				// console.log("newValue", newValue);
				if (onChange) {
					onChange(newValue);
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

		return (
			<div ref="wrapper" className="dmodel-slider-wrapper" style={{position: "relative", width, height: totalHeight}}>
				<div className="dmodel-slider-background" style={{position: "relative", width: slidingWidth, height, left: halfSliderWidth, backgroundColor}}></div>
				<div ref="slider" className="dmodel-slider" style={{position: "absolute", zIndex: 1, top: 0, left: sliderX, height, cursor: "col-resize"}}>
					<div style={shaftStyle}></div>
					<div style={arrowStyle}></div>
				</div>
				{labels ? <div className="dmodel-slider-labels" style={{position: "relative", width, height: labelSize}}>{labels}</div> : null}
			</div>
		);
	}
}
