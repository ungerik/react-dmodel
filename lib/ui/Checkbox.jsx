import React from "react";

const checkmarkStyle = {
	display: "inline-block",
	verticalAlign: "sub",
	width: 22,
	height: 22,
	transform: "rotate(45deg)",
};

const checkmarkCheckedCircleStyle = {
	position: "absolute",
	left: 0,
	top: 0,
	width: 22,
	height: 22,
	borderRadius: 11,
	backgroundColor: "green",
};

const checkmarkUncheckedCircleStyle = {
	position: "absolute",
	left: 0,
	top: 0,
	width: 22,
	height: 22,
	borderRadius: 11,
	backgroundColor: "#aaa",
};

const checkmarkStemStyle = {
	position: "absolute",
	left: 11,
	top: 6,
	width: 3,
	height: 9,
	backgroundColor: "#fff",
};

const checkmarkKickStyle = {
	position: "absolute",
	left: 8,
	top: 12,
	width: 3,
	height: 3,
	backgroundColor: "#fff",
};


const checkmarkLabelStyle = {
	fontSize: 18,
	margin: "10px 0",
};



export default function Checkbox({checked, disabled, onChange, children}) {
	if (disabled) {
		// TODO style disabled
		onChange = null;
	}
	const circleStyle = checked ? checkmarkCheckedCircleStyle : checkmarkUncheckedCircleStyle;
	const box = (
		<span style={checkmarkStyle} onClick={children ? null : onChange}>
			<div style={circleStyle}></div>
			<div style={checkmarkStemStyle}></div>
			<div style={checkmarkKickStyle}></div>
		</span>
	);
	return children ? <div onClick={onChange} style={checkmarkLabelStyle}>{box}&nbsp;&nbsp;<label>{children}</label></div> : box;
}

Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
	checked: React.PropTypes.bool,
	onChange: React.PropTypes.func,
	children: React.PropTypes.node,
};
