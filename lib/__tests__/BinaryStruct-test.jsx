/*global jest, describe, beforeEach, it, expect */
jest.autoMockOff();

const React = require("react");
const BinaryStruct = require("../BinaryStruct");
const DataModel = require("../DataModel");
const Float32 = require("../Float32");
const Float64 = require("../Float64");
const Uint8 = require("../Uint8");
const Uint16 = require("../Uint16");
const Int32 = require("../Int32");
const Char8 = require("../Char8");
const ConstChar8 = require("../ConstChar8");


describe("BinaryStruct", () => {
	const dataModel = (
		<DataModel>
			<Float32 name="float0" />
			<Uint8 name="uint0" />
			<Uint16 name="uint1" encodingFactor={256} />
			<Float32 name="float1" />
			<Float64 name="float2" />
			<Float32 name="floatHex" encoding="hex" />
			<Int32 name="intHEX" encoding="HEX" />
			<Char8 name="char5" length={5} />
			<Char8 name="char5nt" length={5} nullTerminated />
			<ConstChar8 name="constChar" length={2} defaultValue="EF" />
		</DataModel>
	);

	let binaryStruct;

	beforeEach(() => {
		binaryStruct = new BinaryStruct(dataModel);
	});

	it("should have the correct buffer size", () => {
		expect(binaryStruct.buffer.byteLength).toBe((32 + 8 + 16 + 32 + 64 + 32*2 + 32*2) / 8 + 5 + 5 + 2);
	});

	it("should find the displayName of DataModel", () => {
		expect(dataModel.type.displayName).toBe("DataModel");
	});

	it("should create a BinaryStruct instance with properties from the dataModel", () => {
		expect(binaryStruct.float0).toBeDefined();
		expect(binaryStruct.uint0).toBeDefined();
		expect(binaryStruct.uint1).toBeDefined();
		expect(binaryStruct.float1).toBeDefined();
		expect(binaryStruct.float2).toBeDefined();
		expect(binaryStruct.floatHex).toBeDefined();
		expect(binaryStruct.intHEX).toBeDefined();
		expect(binaryStruct.char5).toBeDefined();
		expect(binaryStruct.constChar).toBeDefined();
	});

	it("should read the same values from properties that have been written", () => {
		binaryStruct.float0 = 123;
		binaryStruct.uint0 = 255;
		binaryStruct.uint1 = 255;
		binaryStruct.float1 = 456;
		binaryStruct.float2 = 1024;
		binaryStruct.floatHex = -2048;
		binaryStruct.intHEX = -32123;
		binaryStruct.char5 = "12345";
		binaryStruct.char5nt = "123";
		expect(binaryStruct.float0).toBe(123);
		expect(binaryStruct.uint0).toBe(255);
		expect(binaryStruct.uint1).toBe(255);
		expect(binaryStruct.float1).toBe(456);
		expect(binaryStruct.float2).toBe(1024);
		expect(binaryStruct.floatHex).toBe(-2048);
		expect(binaryStruct.intHEX).toBe(-32123);
		expect(binaryStruct.char5).toBe("12345");
		expect(binaryStruct.char5nt).toBe("123");
	});

	it("should check ranges of Char8", () => {
		expect(() => binaryStruct.char5 = "12345x").toThrow();
		expect(() => binaryStruct.char5 = "1234").toThrow();
		expect(() => binaryStruct.char5nt = "12345x").toThrow();
		binaryStruct.char5nt = "";
		expect(binaryStruct.char5nt).toBe("");
	});

	it("should use defaultValue for ConstChar8", () => {
		binaryStruct.setDefault();
		expect(binaryStruct.constChar).toBe("EF");
		binaryStruct.setZero();
		expect(binaryStruct.constChar).toBe("\0\0");

		binaryStruct.constChar = "EF";
		expect(() => binaryStruct.constChar = "aa").toThrow();
		expect(() => binaryStruct.constChar = "a").toThrow();
		expect(() => binaryStruct.constChar = "EFx").toThrow();
		expect(binaryStruct.constChar).toBe("EF");
	});

	it("should encode Float32 correctly as HEX", () => {
		const dataModel = (
			<DataModel>
				<Float32 name="floatHex" encoding="HEX" />
			</DataModel>
		);
		const binaryStruct = new BinaryStruct(dataModel);
		binaryStruct.setDefault();
		expect(binaryStruct.toString()).toBe("00000000");

		// see http://www.h-schmidt.net/FloatConverter/IEEE754.html
		// 2.0 is 0x40000000
		// -2.0 is 0xc0000000
		binaryStruct.floatHex = 2;
		expect(binaryStruct.toString()).toBe("00000040");

		binaryStruct.littleEndian = false;
		binaryStruct.floatHex = 2;
		expect(binaryStruct.toString()).toBe("40000000");
	});

	it("should encode Int32 correctly as HEX", () => {
		const dataModel = (
			<DataModel>
				<Int32 name="intHex" encoding="HEX" />
			</DataModel>
		);
		const binaryStruct = new BinaryStruct(dataModel);
		binaryStruct.setDefault();
		expect(binaryStruct.toString()).toBe("00000000");

		binaryStruct.intHex = 1;
		expect(binaryStruct.toString()).toBe("01000000");

		binaryStruct.intHex = 128;
		expect(binaryStruct.toString()).toBe("80000000");

		binaryStruct.littleEndian = false;
		binaryStruct.intHex = 1;
		expect(binaryStruct.toString()).toBe("00000001");

		binaryStruct.intHex = 0x0123AF80;
		expect(binaryStruct.toString()).toBe("0123AF80");
	});


});
