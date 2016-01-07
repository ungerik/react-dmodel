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
		value:  React.PropTypes.number,
		integer: React.PropTypes.bool,
		ticks: React.PropTypes.bool,
		tickDistance: dmodelPropTypes.validNumber,
		snapToTicks: React.PropTypes.bool,
		tickLabels: React.PropTypes.bool,
		labelFont: React.PropTypes.string,
		labelSize: dmodelPropTypes.validNumber,
		unit: React.PropTypes.string,
		sliderColor: React.PropTypes.string,
		backgroundColor: React.PropTypes.string,
		onChange: React.PropTypes.func,
	};

	static defaultProps = {
		height: 32,
		min: 0,
		max: 100,
		value: 0,
		integer: false,
		ticks: true,
		tickDistance: 10,
		snapToTicks: false,
		tickLabels: true,
		labelFont: `"Lucida Console", Monaco, monospace`,
		labelSize: 16,
		unit: "",
		sliderColor: "#666",
		backgroundColor: "#F0F0F0",
		onChange: null
	};

	state = {
		dragging: false,
		dragValue: 0,
	}

	componentDidMount() {
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
				const { width, height, min, max, value, integer, onChange } = this.props;
				const sliderWidth = height * 0.5;
				const slidingWidth = width - sliderWidth;
				const dx = event.clientX - event.clientX0;
				const lastValue = isNaN(value) ? min : value;
				let newValue = lastValue + dx / slidingWidth * (max - min);
				if (integer) {
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
		const { width, height, min, max, value, /*ticks, tickDistance,*/ tickLabels, labelFont, labelSize, unit, sliderColor, backgroundColor } = this.props;

		const sliderWidth = height * 0.5;
		const halfSliderWidth = sliderWidth * 0.5;
		const halfSliderHeight = height * 0.5;

		let totalHeight = height;
		if (tickLabels) {
			totalHeight += labelSize;
		}

		const slidingWidth = width - sliderWidth;

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

		const sliderX = isNaN(value) ? 0 : (value - min) / (max - min) * slidingWidth;

		return (
			<div ref="wrapper" className="dmodel-slider-wrapper" style={{width, height: totalHeight, position: "relative"}}>
				<div className="dmodel-slider-background" style={{position: "relative", width: slidingWidth, height, left: halfSliderWidth, backgroundColor}}></div>
				<div ref="slider" className="dmodel-slider" style={{position: "absolute", zIndex: 10, top: 0, left: sliderX, height, cursor: "col-resize"}}>
					<div style={shaftStyle}></div>
					<div style={arrowStyle}></div>
				</div>
				{tickLabels ?
					<div className="dmodel-slider-labels" style={{width, height: labelSize}}>

					</div>
				:
					null
				}
			</div>
		);
	}
}
