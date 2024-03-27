/* eslint no-console: 0 */
const chalk = require('chalk');
const shell = require('shelljs');
const path = require('path');

const contentPath = path.join(__dirname, '../../../content/');
const staticPath = path.join(__dirname, '../../static/');

console.log(chalk.green('Attempting to rebuild kiosk application...'));

if (!shell.test('-d', contentPath)) {
  throw new Error(`Cannot rebuild because 'content' folder was not found at ${contentPath}`);
}

if (!shell.test('-d', staticPath)) {
  throw new Error(`Cannot rebuild because 'static' folder was not found at ${staticPath}`);
}

console.log(chalk.green('Copying content...'));
shell.cp('-R', `${contentPath}*`, staticPath);

process.exit(0);
