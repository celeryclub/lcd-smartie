#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { Smartie } from "../dist/src/Smartie.js";

const smartie = Smartie.fromPath("/dev/ttyUSB0");

const argv = yargs(hideBin(process.argv))
  .options({
    backlight: {
      type: "string",
    },
    brightness: {
      alias: "b",
      type: "number",
    },
    contrast: {
      alias: "c",
      type: "number",
    },
    line: {
      alias: "l",
      type: "number",
    },
    message: {
      alias: "m",
      type: "string",
    },
    clear: {
      alias: "c",
    },
  })
  .help().argv;

if (argv.backlight === "on") {
  smartie.backlightOn();
} else if (argv.backlight === "off") {
  smartie.backlightOff();
} else if (argv.brightness) {
  // 0 to 255
  smartie.setBrightness(argv.brightness);
} else if (argv.contrast) {
  // 0 to 255
  smartie.setContrast(argv.contrast);
} else if (argv.message) {
  smartie.writeLine(argv.message, argv.line);
} else if (argv.clear) {
  smartie.clear();
}
