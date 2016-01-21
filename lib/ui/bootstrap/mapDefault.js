/*eslint react/display-name:0 react/prop-types:0 */
import React from "react";
import { Input, FormControls, Nav, NavItem, DropdownButton, MenuItem, Panel, PanelGroup, Accordion, Tabs, Tab } from "react-bootstrap";

import { asArray } from "../..";
import FloatInput from "./FloatInput";
import IntInput from "./IntInput";
import UintInput from "./UintInput";
import Slider from "./Slider";


let translate = text => text;


export function setTranslationFunc(func) {
	translate = func;
}


export default function mapDefault(element, getValue, setValue, parents = []) {
	if (!element || !element.type || !element.type.dataModelType) {
		return element;
	}
	const factoryFunc = mapping[element.type.dataModelType];
	if (!factoryFunc) {
		return element;
	}
	return factoryFunc(element, getValue, setValue, parents);
}


function getLabel(props) {
	return props.label ? translate(props.label) + ":" : null;
}


const columnsParentStyle = {
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "space-between",
};


let uniqueKeyCounter = 0;


function uniqueKey() {
	uniqueKeyCounter++;
	return uniqueKeyCounter.toString();
}


const mapping = {
	DataModel: (element, getValue, setValue, parents) => {
		const props = element.props;
		const childParents = [element, ...parents];
		const mappedChildren = asArray(props.children).map(child => mapDefault(child, getValue, setValue, childParents));

		let style = null;
		if (Number.isInteger(props.style.columns) && props.style.columns > 1) {
			style = columnsParentStyle;
			const wrapStyle = {width: `${100 / props.style.columns - 2 * (props.style.columns-1)}%`};
			for (let i = 0; i < mappedChildren.length; i++) {
				mappedChildren[i] = <div key={mappedChildren[i].props.name} style={wrapStyle}>{mappedChildren[i]}</div>;
			}
		}

		if (props.style.accordion) {
			return <Accordion className="dmodel dmodel-bootstrap" style={style}>{mappedChildren}</Accordion>;
		} else if (props.style.panelGroup) {
			return <PanelGroup className="dmodel dmodel-bootstrap" style={style}>{mappedChildren}</PanelGroup>;
		} else if (props.style.tabs) {
			return <Tabs className="dmodel dmodel-bootstrap" style={style}>{mappedChildren}</Tabs>;
		}
		return <div className="dmodel dmodel-bootstrap" style={style}>{mappedChildren}</div>;
	},

	Group: (element, getValue, setValue, parents) => {
		const props = element.props;
		const childParents = [element, ...parents];
		const mappedChildren = asArray(props.children).map(child => mapDefault(child, getValue, setValue, childParents));
		const key = props.name || props.label || uniqueKey();

		let style = null;
		if (Number.isInteger(props.style.columns) && props.style.columns > 1) {
			style = columnsParentStyle;
			const wrapStyle = {width: `${100 / props.style.columns - 2 * (props.style.columns-1)}%`};
			for (let i = 0; i < mappedChildren.length; i++) {
				mappedChildren[i] = <div key={mappedChildren[i].props.name} style={wrapStyle}>{mappedChildren[i]}</div>;
			}
		}

		const parentStyle = parents[0].props.style;
		if (parentStyle.accordion || parentStyle.panelGroup) {
			return <Panel key={key} eventKey={key} header={getLabel(props)} className="dmodel-group" style={style}>{mappedChildren}</Panel>;
		} else if (parentStyle.tabs) {
			return <Tab key={key} eventKey={key} title={props.label} className="dmodel-group"><div style={style}>{mappedChildren}</div></Tab>;
		}
		return <div key={key} className="dmodel-group" style={style}>{mappedChildren}</div>;
	},

	Float: (element, getValue, setValue) => {
		const props = element.props;
		if (props.style.slider) {
			return <Slider {...{...props.style.slider, ...props}} key={props.name} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
		}
		return <FloatInput {...props} key={props.name} label={getLabel(props)} placeholder={props.style.placeholder} addonAfter={props.unit} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
	},

	Int: (element, getValue, setValue) => {
		const props = element.props;
		if (props.style.slider) {
			return <Slider {...{...props.style.slider, ...props}} integer key={props.name} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
		}
		return <IntInput {...props} key={props.name} label={getLabel(props)} placeholder={props.style.placeholder} addonAfter={props.unit} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
	},

	Uint: (element, getValue, setValue) => {
		const props = element.props;
		if (props.style.slider) {
			return <Slider {...{...props.style.slider, ...props}} integer key={props.name} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
		}
		return <UintInput {...props} key={props.name} label={getLabel(props)} placeholder={props.style.placeholder} addonAfter={props.unit} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
	},

	Text: (element, getValue, setValue) => {
		const props = element.props;
		if (props.multiLine) {
			return <Input {...props} type="textarea" key={props.name} label={getLabel(props)} placeholder={props.style.placeholder} value={getValue(props.name)} onChange={event => setValue(props.name, event.target.value)} />;
		} else {
			return <Input {...props} type="text" key={props.name} label={getLabel(props)} placeholder={props.style.placeholder} value={getValue(props.name)} onChange={event => setValue(props.name, event.target.value)} />;
		}
	},

	StaticText: (element, getValue) => {
		const props = element.props;
		return <FormControls.Static key={props.name} label={getLabel(props)} value={getValue(props.name)} />;
	},

	Enum: (element, getValue, setValue) => {
		const props = element.props;
		const label = getLabel(props);
		const value = getValue(props.name);
		return (
			<div key={props.name} className="form-group dmodel-enum">
				{label ? <label className="control-label">{label}</label> : null}
				{props.style.dropdown ?
					<div>
						<DropdownButton id={label} title={props.optionsPrefix + value + props.optionsPostfix}>
							{
								props.options.map(option => {
									return (
										<MenuItem key={option} eventKey={option} active={option === value} onSelect={() => setValue(props.name, option)}>
											{props.optionsPrefix}{translate(option)}{props.optionsPostfix}
										</MenuItem>
									);
								})
							}
						</DropdownButton>
					</div>
				:
					<Nav bsStyle='pills' stacked={props.style.stacked} activeKey={value} onSelect={key => setValue(props.name, key)}>
						{
							props.options.map(option => {
								return <NavItem key={option} eventKey={option}>{props.optionsPrefix}{translate(option)}{props.optionsPostfix}</NavItem>;
							})
						}
					</Nav>
				}
			</div>
		);
	},
};
