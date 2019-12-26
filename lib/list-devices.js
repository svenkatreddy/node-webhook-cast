const shell = require('shelljs');

module.exports = () => {
  const cattScan = shell.exec('catt scan', { silent:true });

  const { code, stdout, stderr } = cattScan;

  if (code !== 0) {
    console.log(stderr);
    shell.echo('Error: catt command failed');
    shell.exit(1);
  }
  return stdout;
};