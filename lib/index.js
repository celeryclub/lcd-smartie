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

  setBrightness(amount) {
    this.send([0x98, amount]);
  }

  setContrast(amount) {
    this.send([0x50, amount]);
  }

  writeLine(data, line = 1) {
    if (!line || line < 1 || line > 4) {
      line = 1;
    }

    data = data.padEnd(this.width).substring(0, this.width);

    var arr = [];
    for (var i = 0, l = data.length; i < l; i++) {
      var ascii = data.charCodeAt(i);
      arr.push(ascii);
    }

    this.send([0x47, 0x01, line].concat(arr));
  }

  clearScreen() {
    for (let i = 0; i < height; i++) {
      this.writeLine('', i);
    }
  }
}

module.exports = Smartie;
