import { SerialPort } from "serialport";

const DEFAULT_TTY_PATH = "/dev/ttyUSB0";
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 4;
const COMMAND_DELAY = 40;

export default class Smartie {
  private lcd: SerialPort;
  private width: number;
  private height: number;

  constructor(ttyPath = DEFAULT_TTY_PATH, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    this.lcd = new SerialPort({ path: ttyPath, baudRate: 9600 });
    this.width = width;
    this.height = height;
  }

  async send(bytes: number[]) {
    console.log("send", bytes);
    const buffer = Buffer.from([0xfe].concat(bytes));
    this.lcd.write(buffer);
    // await this.sleep()
    console.log("sleep start");
    await new Promise(resolve => setTimeout(resolve, COMMAND_DELAY));
    console.log("sleep end");
  }

  async backlightOn() {
    await this.send([0x42, 0x00]);
  }

  async backlightOff() {
    await this.send([0x46]);
  }

  async setBrightness(amount: number) {
    await this.send([0x98, amount]);
  }

  async setContrast(amount: number) {
    await this.send([0x50, amount]);
  }

  async writeLine(message: string, lineNumber = 1) {
    // console.log("writeLine", message, lineNumber);
    if (!lineNumber || lineNumber < 1 || lineNumber > this.height) {
      lineNumber = 1;
    }

    message = message.padEnd(this.width).substring(0, this.width);

    var arr = [];
    for (var i = 0, l = message.length; i < l; i++) {
      var ascii = message.charCodeAt(i);
      arr.push(ascii);
    }

    await this.send([0x47, 0x01, lineNumber].concat(arr));
  }

  async clearScreen() {
    // await this.writeLine('', 1);
    // await this.writeLine('', 2);
    // await this.writeLine('', 3);
    // await this.writeLine('', 4);
    for (let i = 0; i < this.height; i++) {
      await this.writeLine("", i);
    }
  }

  // async sleep() {
  //   console.log('sleep')
  //   return new Promise((resolve) => {
  //     setTimeout(() => resolve, COMMAND_DELAY);
  //   });
  // }
}
