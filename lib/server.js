const express = require('express');
const bodyParser = require('body-parser');
const app = express(); 

app.use(bodyParser.raw());

const serverWrapper = (port, middleware) => {
  app.use(middleware);
  app.post('/', function (req, res) {
    res.sendStatus(200);
  });
  const server = app.listen(port, function () {
    const  { address, port } = server.address();
    console.log('App listening at http://%s:%s', address, port);
  });

  return app;
};

module.exports = serverWrapper;
