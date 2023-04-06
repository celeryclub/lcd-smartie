# LCD Smartie

## Overview

This project provides a driver for interacting with LCD Smartie devices made by Sure Electronics. Their website is no longer online, but here's [an archived version of the product page](https://web.archive.org/web/20220628052130/http://www.store3.sure-electronics.com/parts-accessories/led/led-display/lcd-smartie).

This project has been rewritten in Node.js. The original Python version can be found [here](https://github.com/celeryclub/smartie-python).

## CLI usage examples

```sh
./bin/smartie.js on --path /dev/ttyUSB0
./bin/smartie.js off --path /dev/ttyUSB0
./bin/smartie.js adjust --path /dev/ttyUSB0 --brightness 4 --contrast 220
./bin/smartie.js write --path /dev/ttyUSB0 --message "sup" --line 1
./bin/smartie.js clear --path /dev/ttyUSB0
```
