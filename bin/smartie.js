const Smartie = require('../lib/index');
const lcd = new Smartie();

const argv = require('yargs/yargs')(process.argv.slice(2))
  .options({
    backlight: {
      type: 'string',
    },
    brightness: {
      alias: 'b',
      type: 'number',
    },
    contrast: {
      alias: 'c',
      type: 'number',
    },
    line: {
      alias: 'l',
      type: 'number',
    },
    message: {
      alias: 'm',
      type: 'string',
    },
    clear: {
      alias: 'c',
    },
  })
  .help().argv;

if (argv.backlight === 'on') {
  lcd.backlightOn();
} else if (argv.backlight === 'off') {
  lcd.backlightOff();
} else if (argv.brightness) {
  // 0 to 255
  lcd.setBrightness(argv.brightness);
} else if (argv.contrast) {
  // 0 to 255
  lcd.setContrast(argv.contrast);
} else if (argv.message) {
  lcd.writeLine(argv.message, argv.line);
} else if (argv.clear) {
  lcd.clearScreen();
}
