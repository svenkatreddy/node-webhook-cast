const dependenyInstall = require('./lib/dependency-install');
const listDevices = require('./lib/list-devices');
const server = require('./lib/server');
const tunnel = require('./lib/tunnel');
const downloadTopPop = require('./lib/downloader');  
const castToDevice = require('./lib/cast-to-device');  
const getFiles =  require('./lib/get-cast-files');

const port = process.env.PORT || 4545;
const castDevice = process.env.CASTDEVICE || 'Living Room TV';
const skipInitialDownlod = process.env.SKIP_INITIAL_DOWNLOAD || false;

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let status = '';

async function handleWebHook(req, res, next) {
  const { url } = req;
  console.log(`someone requested ${url}`);
  switch (url) {
    case '/webhook-on-closing-door' : {
      status = 'start';
      res.status(200).send('ok');
      const filesInOrder = getFiles();
      const files = shuffle(filesInOrder);
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

  if (!skipInitialDownlod) {
    const stdout = await downloadTopPop();
    console.log(stdout);
  }
  // run once every week
  setInterval(async function () {
    const stdout = await downloadTopPop();
    console.log(stdout);
  }, 604800000);

  // Either portforward it or use tunnel from localtunnel.
  // const url = await tunnel(port);
  // console.log(url);
}

return start();
