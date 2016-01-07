function uint8ToHex(uint8) {
	const s = uint8.toString(16);
	return s.length === 2 ? s : "0" + s;
}


export function writeHex(sourceUint8Array, destDataView, destByteOffset = 0) {
	for (const byte of sourceUint8Array) {
		const hex = uint8ToHex(byte);
		destDataView.setUint8(destByteOffset, hex.charCodeAt(0));
		destByteOffset++;
		destDataView.setUint8(destByteOffset, hex.charCodeAt(1));
		destByteOffset++;
	}
}


export function writeHEX(sourceUint8Array, destDataView, destByteOffset = 0) {
	for (const byte of sourceUint8Array) {
		const hex = uint8ToHex(byte).toUpperCase();
		destDataView.setUint8(destByteOffset, hex.charCodeAt(0));
		destByteOffset++;
		destDataView.setUint8(destByteOffset, hex.charCodeAt(1));
		destByteOffset++;
	}
}


export function readHex(sourceDataView, sourceByteOffset, destByteLength) {
	const destUint8Array = new Uint8Array(destByteLength);
	for (let i = 0; i < destByteLength; i++) {
		const high = String.fromCharCode(sourceDataView.getUint8(sourceByteOffset));
		sourceByteOffset++;
		const low = String.fromCharCode(sourceDataView.getUint8(sourceByteOffset));
		sourceByteOffset++;
		destUint8Array[i] = parseInt(high + low, 16);
	}
	return destUint8Array;
}


export function bufferAsChar8String(buffer) {
	let str = "";
	for (const byte of new Uint8Array(buffer)) {
		str += String.fromCharCode(byte);
	}
	return str;
}


export function stringToUint8Array(str) {
	const uint8Array = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		uint8Array[i] = str.charCodeAt(i);
	}
	return uint8Array;
}


export function bufferToHexString(buffer) {
	let str = "";
	for (const byte of new Uint8Array(buffer)) {
		str += uint8ToHex(byte).toUpperCase();
	}
	return str;
}


export function hexStringToUint8Array(str) {
	const uint8Array = new Uint8Array(str.length / 2);
	for (let i = 0; i < uint8Array.byteLength; i++) {
		uint8Array[i] = parseInt(str.substr(i * 2, 2), 16);
	}
	return uint8Array;
}


export function encodeValue(value, dataView, byteOffset, littleEndian, props, dataType) {
	let arr;
	switch (props.encoding) {
	case "binary":
		dataType.writeBinary(value, dataView, byteOffset, littleEndian, props);
		return;

	case "hex":
		arr = new Uint8Array(dataType.byteLength(props) / 2);
		dataType.writeBinary(value, new DataView(arr.buffer), 0, littleEndian, props);
		writeHex(arr, dataView, byteOffset);
		return;

	case "HEX":
		arr = new Uint8Array(dataType.byteLength(props) / 2);
		dataType.writeBinary(value, new DataView(arr.buffer), 0, littleEndian, props);
		writeHEX(arr, dataView, byteOffset);
		return;
	}

	throw new Error("encoding type not supported: " + props.encoding);
}


export function decodeValue(dataView, byteOffset, littleEndian, props, dataType) {
	switch (props.encoding) {
	case "binary":
		return dataType.readBinary(dataView, byteOffset, littleEndian, props);

	case "hex":
	case "HEX":
		const arr = readHex(dataView, byteOffset, dataType.byteLength(props) / 2);
		return dataType.readBinary(new DataView(arr.buffer), 0, littleEndian, props);
	}

	throw new Error("encoding type not supported: " + props.encoding);
}


export function byteLengthFunc(binaryLength) {
	return (props) => {
		switch (props.encoding) {
		case "binary":
			return binaryLength;

		case "hex":
		case "HEX":
			return binaryLength * 2;
		}

		throw new Error("encoding type not supported: " + props.encoding);
	};
}
