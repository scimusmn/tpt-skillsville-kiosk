/* eslint no-console: 0 */
const chalk = require('chalk');
const shell = require('shelljs');
const path = require('path');

const contentPath = path.join(__dirname, '../../../content/');
const staticPath = path.join(__dirname, '../../static/');

console.log(chalk.green('Setting up content folder in parent folder...'));
shell.mkdir('-p', contentPath);
shell.cp('-R', path.join(staticPath, '*'), contentPath);

console.log(chalk.green('Copying kiosk scripts to parent folder...'));
shell.cp(path.join(__dirname, '../../win-kiosk/rebuild.bat'), path.join(__dirname, '../../../'));
shell.cp(path.join(__dirname, '../../win-kiosk/launch-preview.bat'), path.join(__dirname, '../../../'));

process.exit(0);
