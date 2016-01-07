import { forEachChildElement, findChildElement } from "./functions";
import { bufferAsChar8String, bufferToHexString } from "./encoding";


export default class BinaryStruct {
	constructor(dataModel, littleEndian = true, buffer = null) {
		this.dataModel = dataModel;
		this.littleEndian = littleEndian;
		this.byteLength = 0;
		forEachChildElement(dataModel, ({ type, props }) => {
			const byteOffset = this.byteLength;
			Object.defineProperty(this, props.name, {
				get: () => type.read(this.dataView, byteOffset, this.littleEndian, props),
				set: value => {
					const error = type.checkValue(value, props);
					if (error) {
						throw error;
					}
					type.write(value, this.dataView, byteOffset, this.littleEndian, props);
				},
			});
			this.byteLength += type.byteLength(props);
		});
		if (buffer === null) {
			this.buffer = new ArrayBuffer(this.byteLength);
		} else {
			if (buffer.byteLength !== this.byteLength) {
				throw Error(`Supplied buffer length of ${buffer.byteLength} does not match dataModel length of ${this.byteLength}`);
			}
			this.buffer = buffer;
		}
		this.dataView = new DataView(this.buffer);
	}

	setDefault(name = null) {
		if (name === null) {
			forEachChildElement(this.dataModel, ({ type, props }) => {
				const defaultValue = type.dynamicDefaultValue ? type.dynamicDefaultValue(props) : props.defaultValue;
				this[props.name] = defaultValue;
			});
		} else {
			const element = findChildElement(this.dataModel);
			if (element === null) {
				throw new Error(`Element with name "${name} not found"`);
			}
			const { type, props } = element;
			const defaultValue = type.dynamicDefaultValue ? type.dynamicDefaultValue(props) : props.defaultValue;
			this[props.name] = defaultValue;
		}
		return this;
	}

	setZero() {
		for (let i = 0; i < this.byteLength; i++) {
			this.dataView.setUint8(i, 0);
		}
		return this;
	}

	toString() {
		return bufferAsChar8String(this.buffer);
	}

	toHexString() {
		return bufferToHexString(this.buffer);
	}

	toObject() {
		const obj = {};
		forEachChildElement(this.dataModel, ({ props }) => {
			obj[props.name] = this[props.name];
		});
		return obj;
	}

	toJSON() {
		return JSON.stringify(this.toObject());
	}

	checkValues() {
		let error = null;
		forEachChildElement(this.dataModel, ({ type, props }) => {
			error = type.checkValue(this[props.name], props);
			return !!error;
		});
		return error;
	}

}
