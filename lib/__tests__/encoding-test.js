/*global jest, describe, it, expect */
jest.autoMockOff();

const encoding = require("../encoding");


describe("encoding", () => {

	it("should encode and decode strings to/from Uint8Array", () => {
		const str = "Hello 0xFA01! \n\t\r";
		const arr = encoding.stringToUint8Array(str);
		expect(encoding.bufferAsChar8String(arr)).toBe(str);
	});

	it("should encode and decode hex strings to/from Uint8Array", () => {
		const str = "FFAA011079A3";
		const arr = encoding.hexStringToUint8Array(str);
		expect(encoding.bufferToHexString(arr)).toBe(str);
	});

	it("should encode and decode consistently with writeHex and readHex", () => {
		const sourceUint8Array = new Uint8Array([255, 0, 100, 200, 255]);
		const destByteOffset = 17;
		const destDataView = new DataView(new Uint8Array(sourceUint8Array.length * 2 + destByteOffset).buffer);
		encoding.writeHEX(sourceUint8Array, destDataView, destByteOffset);

		const sourceDataView = destDataView;
		const sourceByteOffset = destByteOffset;
		const destByteLength = sourceUint8Array.byteLength;
		const destUint8Array = encoding.readHex(sourceDataView, sourceByteOffset, destByteLength);

		expect(destUint8Array).toEqual(sourceUint8Array);
	});

});
