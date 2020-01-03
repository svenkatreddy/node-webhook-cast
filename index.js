const shell = require('shelljs');
const dependenyInstall = require('./lib/dependency-install');
const listDevices = require('./lib/list-devices');
const server = require('./lib/server');
const tunnel = require('./lib/tunnel');
const downloadTopPop = require('./lib/download-top-pop-songs');  
const castToDevice = require('./lib/cast-to-device');  
const getFiles =  require('./lib/get-cast-files');

const port = process.env.PORT || 4545;
const castDevice = process.env.CASTDEVICE || 'Living Room TV';

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

let status = '';

async function handleWebHook(req, res, next) {
  const { url } = req;
  console.log(`someone requested ${url}`);
  switch (url) {
    case '/webhook-on-closing-door' : {
      status = 'start';
      res.status(200).send('ok');
      const files = getFiles();
      await asyncForEach(files, async (file) => {
        if (status !== 'stop') await castToDevice.start(castDevice, file, 'local');
      });
      return false;
    }
    case '/webhook-on-opening-door' : {
      status = 'stop';
      res.status(200).send('ok');
      return castToDevice.stop(castDevice);
    }
  }
  return next();
};

async function start () {
  // install required dependencies of pip3, python, youtube-dl
  dependenyInstall();
  
  // get list of devices available
  const devices = listDevices();
  console.log(devices);

  // start webserver to receive webhook connection.
  server(port, handleWebHook);

  await downloadTopPop();
  // run once every week
  setInterval(async function () {
    await downloadTopPop();
  }, 604800);

  // Either portforward it or use tunnel from localtunnel.
  // const url = await tunnel(port);
  // console.log(url);
}

return start();
