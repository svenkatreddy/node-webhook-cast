const { spawn } = require('child_process');
const mm = require('music-metadata');
const fs = require('fs');
let catt;

module.exports = {
  stop: (deviceName) => {
    // kills the process which is running catt, however it doesn't playing music
    if (catt && catt.kill) catt.kill();
    // stops music playing on cast device
    spawn('catt', ['-d', deviceName, 'stop']);
  },
  start: async (deviceName, options, type) => {
    return new Promise((resolve, reject) => {
      console.log(`catt -d "${deviceName}" cast "${options}"`);
      // terminate any previous running sessions
      if (catt && catt.kill) catt.kill();

      // catt = shell.exec(`catt -d "${deviceName}" cast `, {async: true});
      catt = spawn('catt', ['-d', deviceName, 'cast', options]);

      catt.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      
      catt.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
      
      catt.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });

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
  }
};