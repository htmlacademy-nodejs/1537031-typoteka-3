'use strict';

const chalk = require(`chalk`);

const packageJson = require(`../../../package.json`);
const version = packageJson.version;

module.exports = {
  name: `--version`,
  run() {
    console.log(chalk.blue(version));
  }
};
