const shell = require('shelljs');

module.exports = (deviceName, options) => {
  console.log(`catt -d "${deviceName}" cast ${options}`);
  const cattScan = shell.exec(`catt -d "${deviceName}" cast ${options}`);

  const { code, stdout } = cattScan;

  if (code !== 0) {
    shell.echo('Error: catt command failed');
    shell.exit(1);
  }
  return stdout;
};