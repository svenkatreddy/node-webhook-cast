const shell = require('shelljs');

module.exports = () => {
  if (!shell.which('pip3')) {
    shell.echo('Sorry, this package requires pip3, python3');
    shell.exit(1);
  }
  
  if (!shell.which('catt')) {
    if (shell.exec('pip3 install catt').code !== 0) {
      shell.echo('Unable to install catt');
      shell.exit(1);
    }
  }
};