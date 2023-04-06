#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { Smartie } from "../dist/src/Smartie.js";

yargs(hideBin(process.argv))
  .options({
    path: {
      type: "string",
      alias: "p",
      demandOption: true,
    },
  })
  .command({
    command: "on",
    desc: "Turn the backlight on",
    handler: argv => {
      const smartie = Smartie.fromPath(argv.path);
      smartie.backlightOn();
    },
  })
  .command({
    command: "off",
    desc: "Turn the backlight off",
    handler: argv => {
      const smartie = Smartie.fromPath(argv.path);
      smartie.backlightOff();
    },
  })
  .command({
    command: "adjust",
    desc: "Adjust brightness and contrast",
    builder: yargs =>
      yargs.options({
        brightness: {
          type: "number",
          alias: "b",
        },
        contrast: {
          type: "number",
          alias: "c",
        },
      }),
    handler: argv => {
      if (!argv.brightness && !argv.contrast) {
        throw new Error("Either brightness or contrast must be provided");
      }

      const smartie = Smartie.fromPath(argv.path);
      if (argv.brightness) {
        smartie.setBrightness(argv.brightness);
      }
      if (argv.contrast) {
        smartie.setContrast(argv.contrast);
      }
    },
  })
  .command({
    command: "write",
    desc: "Write message to screen",
    builder: yargs =>
      yargs.options({
        message: {
          type: "string",
          alias: "m",
          demandOption: true,
        },
        line: {
          type: "number",
          alias: "l",
          demandOption: true,
        },
      }),
    handler: argv => {
      const smartie = Smartie.fromPath(argv.path);
      smartie.writeLine(argv.message, argv.line);
    },
  })
  .command({
    command: "clear",
    desc: "Clear screen",
    handler: argv => {
      const smartie = Smartie.fromPath(argv.path);
      smartie.clear();
    },
  })
  .demandCommand()
  .help().argv;
