const shell = require('shelljs');
const dependenyInstall = require('./lib/dependency-install');
const listDevices = require('./lib/list-devices');
const server = require('./lib/server');
const tunnel = require('./lib/tunnel');
const castToDevice = require('./lib/cast-to-device');  

const port = process.env.PORT || 4545;

function handleWebHook(req, res, next) {
  const { url } = req;
  switch (url) {
    case '/' : {
      castToDevice('Living room speaker', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    }
  }
  return next();
};

async function start () {
  dependenyInstall();
  const devices = listDevices();
  console.log(devices);
  server(port, handleWebHook);
  const url = await tunnel(port);
  console.log(url);
}

return start();
