/*eslint react/display-name:0 react/prop-types:0 */
import React from "react";
import { Input, FormControls, Nav, NavItem, DropdownButton, MenuItem, Panel, PanelGroup, Accordion, Tabs, Tab } from "react-bootstrap";

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


export default function mapDefault(element, getValue, setValue, extraProps = {}, parents = [], refCallback = noop, childKey = "parent") {
	if (!element || !element.type || !element.type.dataModelType) {
		return element;
	}
	const factoryFunc = mapping[element.type.dataModelType];
	if (!factoryFunc) {
		return element;
	}
	return factoryFunc(element, getValue, setValue, extraProps, parents, refCallback, childKey);
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
	DataModel: (element, getValue, setValue, extraProps, parents, refCallback) => {
		const props = element.props;
		const childParents = [element, ...parents];
		const mappedChildren = asArray(props.children).map((child, childKey) => {
			return mapDefault(child, getValue, setValue, extraProps, childParents, refCallback, childKey);
		});

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

	Group: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		const childParents = [element, ...parents];
		const mappedChildren = asArray(props.children).map((child, childKey) => {
			return mapDefault(child, getValue, setValue, extraProps, childParents, refCallback, childKey);
		});

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
			return (
				<Panel
					key={key}
					eventKey={key}
					header={getLabel(props)}
					className="dmodel-group"
					style={style}
				>
					{mappedChildren}
				</Panel>
			);
		} else if (parentStyle.tabs) {
			return (
				<Tab
					key={key}
					eventKey={key}
					title={translate(props.label)}
					className="dmodel-group"
				>
					<div style={style}>{mappedChildren}</div>
				</Tab>
			);
		}
		return <div key={key} className="dmodel-group" style={style}>{mappedChildren}</div>;
	},

	Bool: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.children) {
			return React.cloneElement(props.children, {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}});
		}
		return (
			<Input
				{...{...props, ...extraProps}}
 				type="checkbox"
 				ref={refCallback}
				key={key}
				label={getLabel(props)}
				disabled={setValue === null}
				checked={getValue(props.name)}
				onChange={() => setValue(props.name, !getValue(props.name))}
			/>
		);
	},

	Float: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.children) {
			return React.cloneElement(props.children, {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}});
		}
		if (props.style.slider) {
			return (
				<Slider
					{...{...props.style.slider, ...props, ...extraProps}}
					ref={refCallback}
					key={key}
					label={getLabel(props)}
					fixed={setValue === null}
					value={getValue(props.name)}
					onChange={value => setValue(props.name, value)}
				/>
			);
		}
		return (
			<FloatInput
				{...{...props, ...extraProps}}
				ref={refCallback}
				key={key}
				label={getLabel(props)}
				disabled={setValue === null}
				placeholder={props.style.placeholder}
				addonAfter={props.unit}
				value={getValue(props.name)}
				onChange={value => setValue(props.name, value)}
			/>
		);
	},


	Int: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.children) {
			return React.cloneElement(props.children, {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}});
		}
		if (props.style.slider) {
			return (
				<Slider
					{...{...props.style.slider, ...props, ...extraProps}}
					ref={refCallback}
					key={key}
					label={getLabel(props)}
					fixed={setValue === null}
					integer
					value={getValue(props.name)}
					onChange={value => setValue(props.name, value)}
				/>
			);
		}
		return (
			<IntInput
				{...{...props, ...extraProps}}
				ref={refCallback}
				key={key}
				label={getLabel(props)}
				disabled={setValue === null}
				placeholder={props.style.placeholder}
				addonAfter={props.unit}
				value={getValue(props.name)}
				onChange={value => setValue(props.name, value)}
			/>
		);
	},

	Uint: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.children) {
			return React.cloneElement(props.children, {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}});
		}
		if (props.style.slider) {
			return (
				<Slider
					{...{...props.style.slider, ...props, ...extraProps}}
					ref={refCallback}
					key={key}
					label={getLabel(props)}
					fixed={setValue === null}
					integer
					value={getValue(props.name)}
					onChange={value => setValue(props.name, value)}
				/>
			);
		}
		return (
			<UintInput
				{...{...props, ...extraProps}}
				ref={refCallback}
				key={key}
				label={getLabel(props)}
				disabled={setValue === null}
				placeholder={props.style.placeholder}
				addonAfter={props.unit}
				value={getValue(props.name)}
				onChange={value => setValue(props.name, value)}
			/>
		);
	},

	Text: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.children) {
			return React.cloneElement(props.children, {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}});
		}
		return (
			<TextInput
				{...{...props, ...extraProps}}
				ref={refCallback}
				key={key}
				label={getLabel(props)}
				disabled={setValue === null}
				placeholder={props.style.placeholder}
				value={getValue(props.name)}
				onChange={value => setValue(props.name, value)}
			/>
		);
	},

	StaticText: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.children) {
			return React.cloneElement(props.children, {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}});
		}
		return <FormControls.Static key={key} label={getLabel(props)} value={getValue(props.name)} />;
	},

	Enum: (element, getValue, setValue, extraProps, parents, refCallback, key) => {
		const props = element.props;
		if (props.children) {
			return React.cloneElement(props.children, {...props, ...extraProps, ...{getValue, setValue, parents, refCallback, key}});
		}
		const label = getLabel(props);
		const value = getValue(props.name);
		return (
			<div key={key} className="form-group dmodel-enum">
				{label ? <label className="control-label">{label}</label> : null}
				{props.style.dropdown ?
					<div>
						<DropdownButton {...extraProps} id={label} disabled={setValue === null} title={props.optionsPrefix + translate(value) + props.optionsPostfix}>
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
					<Nav {...extraProps} bsStyle='pills' stacked={props.style.stacked} activeKey={value} onSelect={setValue === null ? null : key => setValue(props.name, key)}>
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
