const shell = require('shelljs');
const mm = require('music-metadata');
const fs = require('fs');
let catt;

module.exports = async (deviceName, options, type) => {
  return new Promise((resolve, reject) => {
    console.log(`catt -d "${deviceName}" cast "${options}"`);
    // terminate any previous running sessions
    if (catt && catt.kill) catt.kill();

    catt = shell.exec(`catt -d "${deviceName}" cast "${options}"`, {async: true});

    if (type === 'local') {
      const buffer = fs.readFileSync(options); 
      mm.parseBuffer(buffer, { duration: true})
      .then( metadata => {
        const ms = metadata.format.duration * 1000;
        console.log(`delaying until milliseconds : ${ms} till next song`);
        setTimeout(function(){
          catt.kill();
          return resolve();
        }, ms || 120000);
      })
      .catch((err) => {
        console.error(err.message);
      });
    }
  });
};