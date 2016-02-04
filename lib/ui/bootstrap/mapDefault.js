/*eslint react/display-name:0 react/prop-types:0 */
import React from "react";
import { FormControls, Nav, NavItem, DropdownButton, MenuItem, Panel, PanelGroup, Accordion, Tabs, Tab } from "react-bootstrap";

import { asArray } from "../..";
import FloatInput from "./FloatInput";
import IntInput from "./IntInput";
import UintInput from "./UintInput";
import TextInput from "./TextInput";
import Slider from "./Slider";


let translate = text => text;


export function setTranslationFunc(func) {
	translate = func;
}


function noop() {
}


export default function mapDefault(element, getValue, setValue, inputProps = {}, parents = [], refCallback = noop, childKey = "parent") {
	if (!element || !element.type || !element.type.dataModelType) {
		return element;
	}
	const factoryFunc = mapping[element.type.dataModelType];
	if (!factoryFunc) {
		return element;
	}
	return factoryFunc(element, getValue, setValue, inputProps, parents, refCallback, childKey);
}


function getLabel(props) {
	return props.label ? translate(props.label) + ":" : null;
}


const columnsParentStyle = {
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "space-between",
};


const mapping = {
	DataModel: (element, getValue, setValue, inputProps, parents, refCallback) => {
		const props = element.props;
		const childParents = [element, ...parents];
		const mappedChildren = asArray(props.children).map((child, childKey) => mapDefault(child, getValue, setValue, inputProps, childParents, refCallback, childKey));

		let style = null;
		if (Number.isInteger(props.style.columns) && props.style.columns > 1) {
			style = columnsParentStyle;
			const wrapStyle = {width: `${100 / props.style.columns - 2 * (props.style.columns-1)}%`};
			for (let i = 0; i < mappedChildren.length; i++) {
				mappedChildren[i] = <div key={i} style={wrapStyle}>{mappedChildren[i]}</div>;
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

	Group: (element, getValue, setValue, inputProps, parents, refCallback, key) => {
		const props = element.props;
		const childParents = [element, ...parents];
		const mappedChildren = asArray(props.children).map((child, childKey) => mapDefault(child, getValue, setValue, inputProps, childParents, refCallback, childKey));

		let style = null;
		if (Number.isInteger(props.style.columns) && props.style.columns > 1) {
			style = columnsParentStyle;
			const wrapStyle = {width: `${100 / props.style.columns - 2 * (props.style.columns-1)}%`};
			for (let i = 0; i < mappedChildren.length; i++) {
				mappedChildren[i] = <div key={i} style={wrapStyle}>{mappedChildren[i]}</div>;
			}
		}

		const parentStyle = parents[0].props.style;
		if (parentStyle.accordion || parentStyle.panelGroup) {
			return <Panel key={key} eventKey={key} header={getLabel(props)} className="dmodel-group" style={style}>{mappedChildren}</Panel>;
		} else if (parentStyle.tabs) {
			return <Tab key={key} eventKey={key} title={translate(props.label)} className="dmodel-group"><div style={style}>{mappedChildren}</div></Tab>;
		}
		return <div key={key} className="dmodel-group" style={style}>{mappedChildren}</div>;
	},

	Float: (element, getValue, setValue, inputProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.style.slider) {
			return <Slider {...{...props.style.slider, ...inputProps, ...props}} ref={refCallback} key={key} label={getLabel(props)} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
		}
		return <FloatInput {...{...inputProps, ...props}} ref={refCallback} key={key} label={getLabel(props)} placeholder={props.style.placeholder} addonAfter={props.unit} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
	},

	Int: (element, getValue, setValue, inputProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.style.slider) {
			return <Slider {...{...props.style.slider, ...inputProps, ...props}} ref={refCallback} key={key} label={getLabel(props)} integer value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
		}
		return <IntInput {...{...inputProps, ...props}} ref={refCallback} key={key} label={getLabel(props)} placeholder={props.style.placeholder} addonAfter={props.unit} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
	},

	Uint: (element, getValue, setValue, inputProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.style.slider) {
			return <Slider {...{...props.style.slider, ...inputProps, ...props}} ref={refCallback} key={key} label={getLabel(props)} integer value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
		}
		return <UintInput {...{...inputProps, ...props}} ref={refCallback} key={key} label={getLabel(props)} placeholder={props.style.placeholder} addonAfter={props.unit} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
	},

	Text: (element, getValue, setValue, inputProps, parents, refCallback, key) => {
		const props = element.props;
		return <TextInput {...{...inputProps, ...props}} ref={refCallback} key={key} label={getLabel(props)} placeholder={props.style.placeholder} value={getValue(props.name)} onChange={value => setValue(props.name, value)} />;
	},

	StaticText: (element, getValue, setValue, inputProps, parents, refCallback, key) => {
		const props = element.props;
		return <FormControls.Static key={key} label={getLabel(props)} value={getValue(props.name)} />;
	},

	Enum: (element, getValue, setValue, inputProps, parents, refCallback, key) => {
		const props = element.props;
		const label = getLabel(props);
		const value = getValue(props.name);
		return (
			<div key={key} className="form-group dmodel-enum">
				{label ? <label className="control-label">{label}</label> : null}
				{props.style.dropdown ?
					<div>
						<DropdownButton {...inputProps} id={label} title={props.optionsPrefix + translate(value) + props.optionsPostfix}>
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
					<Nav {...inputProps} bsStyle='pills' stacked={props.style.stacked} activeKey={value} onSelect={key => setValue(props.name, key)}>
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
