import { asArray } from "./utils";


export function goStructFromDataModel(dataModel, packageName, structName) {
	let goSource = "package " + packageName + "\n\n";

	goSource += "type " + structName + " struct {\n";

	goSource += render(dataModel);

	goSource += "}\n";

	return goSource ;
}


export function render(element) {
	if (!element || !element.type || !element.type.dataModelType) {
		return "";
	}
	const renderFunc = mapping[element.type.dataModelType];
	return renderFunc ? renderFunc(element) : "";
}


function toUpperCaseFirstChar(str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
}


function goExportableName(name) {
	name = name.replace(/\s/g, "");
	return toUpperCaseFirstChar(name);
}


const mapping = {
	DataModel: element => {
		return asArray(element.props.children).reduce((previous, current) => previous + render(current), "");
	},

	Group: element => {
		if (element.props.name) {
			throw new Error("Named groups not implemented yet");
		}
		return asArray(element.props.children).reduce((previous, current) => previous + render(current), "");
	},

	Float: ({ props }) => {
		return "\t" + `${goExportableName(props.name)} float64 \`json:"${props.name}"\`` + "\n";
	},

	Int: ({ props }) => {
		return "\t" + `${goExportableName(props.name)} int64 \`json:"${props.name}"\`` + "\n";
	},

	Uint: ({ props }) => {
		return "\t" + `${goExportableName(props.name)} uint64 \`json:"${props.name}"\`` + "\n";
	},

	Text: ({ props }) => {
		return "\t" + `${goExportableName(props.name)} string \`json:"${props.name}"\`` + "\n";
	},

	StaticText: ({ props }) => {
		return "\t" + `${goExportableName(props.name)} string \`json:"${props.name}"\`` + "\n";
	},

	Enum: ({ props }) => {
		return "\t" + `${goExportableName(props.name)} string \`json:"${props.name}"\`` + "\n";
	},
};
