/* eslint no-console: 0 */
const commandExistsSync = require('command-exists').sync;

require('dotenv').config({
  path: '.env.development',
});

const { execSync } = require('child_process');
const readline = require('readline');

function performClean() {
  execSync(`
    contentful-clean-space \
      --space-id ${process.env.CONTENTFUL_SPACE_ID} \
      --accesstoken ${process.env.CONTENTFUL_MANAGEMENT_TOKEN} \
      --content-types=true \
      --assets=true \
      --env ${process.env.CONTENTFUL_ENVIRONMENT} \
      --yes=false \
    `, { stdio: 'inherit' });
  console.log('Clean completed.');
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('close', () => {
  console.log('\nBYE BYE !!!');
  process.exit(0);
});

if (commandExistsSync('contentful-clean-space2')) {
  performClean(process.env.CONTENTFUL_ENVIRONMENT);
} else {
  console.error('NOT FOUND! Install contentful-clean-space: https://github.com/jugglingthebits/contentful-clean-space');
  process.exit(1);
}
