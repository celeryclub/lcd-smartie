import { SerialPort } from "serialport";

const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 4;

export class Smartie {
  private _port: SerialPort;
  private _width: number;
  private _height: number;

  constructor(port: SerialPort, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    this._port = port;
    this._width = width;
    this._height = height;
  }

  private async _send(bytes: number[]) {
    this._port.write([0xfe].concat(bytes));
    await new Promise(resolve => this._port.drain(resolve));
  }

  async backlightOn() {
    await this._send([0x42, 0x00]);
  }

  async backlightOff() {
    await this._send([0x46]);
  }

  // Brightness range is 0-255
  async setBrightness(amount: number) {
    if (amount < 0 || amount > 255) {
      throw new Error("Brightness amount must be between 0 and 255");
    }

    await this._send([0x98, amount]);
  }

  // Contrast range is 0-255
  async setContrast(amount: number) {
    if (amount < 0 || amount > 255) {
      throw new Error("Contrast amount must be between 0 and 255");
    }

    await this._send([0x50, amount]);
  }

  // Line number range is 0 to screen height - 1
  async writeLine(message: string, lineNumber: number) {
    if (lineNumber < 0 || lineNumber > this._height - 1) {
      throw new Error("Line number must be within range of screen height");
    }

    // Pad short strings and trim long strings
    message = message.padEnd(this._width).substring(0, this._width);
    await this._send([0x47, 0x01, lineNumber + 1].concat(...Buffer.from(message)));
  }

  async clear() {
    for (let i = 0; i < this._height; i++) {
      await this.writeLine("", i);
    }
  }
}
