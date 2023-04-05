import { SerialPort } from "serialport";
import { expect } from "chai";
import { stubInterface, StubbedInstance } from "ts-sinon";
import { Smartie } from "./Smartie";

describe("Smartie", () => {
  let port: StubbedInstance<SerialPort>;
  let smartie: Smartie;

  beforeEach(() => {
    port = stubInterface<SerialPort>();
    port.drain.callsFake(callback => {
      setTimeout(callback!, 0);
    });
    smartie = new Smartie(port);
  });

  describe("backlightOn", () => {
    it("should send the correct bytes", async () => {
      await smartie.backlightOn();
      expect(port.write).to.be.calledOnceWith([0xfe, 0x42, 0x00]);
    });
  });

  describe("backlightOff", () => {
    it("should send the correct bytes", async () => {
      await smartie.backlightOff();
      expect(port.write).to.be.calledOnceWith([0xfe, 0x46]);
    });
  });

  describe("setBrightness", () => {
    it("should send the correct bytes", async () => {
      await smartie.setBrightness(45);
      expect(port.write).to.be.calledOnceWith([0xfe, 0x98, 45]);
    });

    it("should reject if amount is outside of valid range", async () => {
      await expect(smartie.setBrightness(900)).to.be.rejectedWith(
        "Brightness amount must be between 0 and 255"
      );
    });
  });

  describe("setContrast", () => {
    it("should send the correct bytes", async () => {
      await smartie.setContrast(207);
      expect(port.write).to.be.calledOnceWith([0xfe, 0x50, 207]);
    });

    it("should reject if amount is outside of valid range", async () => {
      await expect(smartie.setContrast(-9)).to.be.rejectedWith(
        "Contrast amount must be between 0 and 255"
      );
    });
  });

  describe("writeLine", () => {
    it("should send the correct bytes for a short message", async () => {
      await smartie.writeLine("hello", 2);
      expect(port.write).to.be.calledOnceWith(
        [0xfe, 0x47, 0x01, 3].concat(...Buffer.from("hello")).concat(Array(15).fill(32))
      );
    });

    it("should send the correct bytes for a long message", async () => {
      await smartie.writeLine("it's really a pleasure to meet you", 3);
      expect(port.write).to.be.calledOnceWith(
        [0xfe, 0x47, 0x01, 4].concat(...Buffer.from("it's really a pleasu"))
      );
    });

    it("should reject if line number is outside of valid range", async () => {
      await expect(smartie.writeLine("hi", 99)).to.be.rejectedWith(
        "Line number must be within range of screen height"
      );
    });
  });

  describe("clear", () => {
    it("should send the correct bytes", async () => {
      await smartie.clear();
      expect(port.write).to.be.calledWith([0xfe, 0x47, 0x01, 1].concat(Array(20).fill(32)));
      expect(port.write).to.have.callCount(4);
    });
  });
});
