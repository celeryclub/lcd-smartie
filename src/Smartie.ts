import { SerialPort } from "serialport";

const DEFAULT_TTY_PATH = "/dev/ttyUSB0";
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 4;

export default class Smartie {
  private _port: SerialPort;
  private _width: number;
  private _height: number;

  constructor(ttyPath = DEFAULT_TTY_PATH, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    this._port = new SerialPort({ path: ttyPath, baudRate: 9600 });
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
      console.error("Brightness amount must be between 0 and 255");
      return;
    }

    await this._send([0x98, amount]);
  }

  // Contrast range is 0-255
  async setContrast(amount: number) {
    if (amount < 0 || amount > 255) {
      console.error("Contrast amount must be between 0 and 255");
      return;
    }

    await this._send([0x50, amount]);
  }

  // Line number range is 0 to screen height - 1
  async writeLine(message: string, lineNumber: number) {
    if (lineNumber < 0 || lineNumber > this._height - 1) {
      console.error("Line number must be within range of screen height");
      return;
    }

    // Pad short strings and trim long strings
    message = message.padEnd(this._width).substring(0, this._width);
    await this._send([0x47, 0x01, lineNumber].concat(...Buffer.from(message)));
  }

  async clear() {
    for (let i = 0; i < this._height; i++) {
      await this.writeLine("", i);
    }
  }
}

(async () => {
  const smartie = new Smartie();

  await smartie.backlightOn();
  await smartie.backlightOff();
  await smartie.setBrightness(45);
  await smartie.setContrast(205);
  await smartie.writeLine("hello", 2);
  await smartie.clear();
})();
