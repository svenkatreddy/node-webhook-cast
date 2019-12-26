const localtunnel = require('localtunnel');

async function tunnel (port) {
  const tunnel = await localtunnel({ port, subdomain: 'venkat-home-automation', host: 'https://tunnel.datahub.at/' });

  tunnel.on('close', () => {
    console.log('Tunnel is closed');  
    process.exit(1);
  });

  return tunnel.url;
};

module.exports = tunnel;