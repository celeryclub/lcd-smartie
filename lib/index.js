const SerialPort = require('serialport');

const DEFAULT_TTY_PATH = '/dev/ttyUSB0';
const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 4;

class Smartie {
  constructor(ttyPath = DEFAULT_TTY_PATH, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    this.lcd = new SerialPort(ttyPath);
    this.width = width;
    this.height = height;
  }

  send(bytes) {
    const buffer = Buffer.from([0xFE].concat(bytes));
    this.lcd.write(buffer);
  }

  backlightOn() {
    this.send([0x42, 0x00]);
  }

  backlightOff() {
    this.send(0x46);
  }
}

module.exports = Smartie;
