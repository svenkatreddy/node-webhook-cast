const shell = require('shelljs');

module.exports = (deviceName, options) => {
  return new Promise((resolve, reject) => {
    shell.mkdir('-p','music/older', 'music/current');
    shell.mv('music/current/*.*','music/older');
    const youtubeDl = shell.exec(`youtube-dl --download-archive music/current/archive.txt -4icwxo "music/current/%(playlist_index)s - %(title)s.mp3"  "https://www.youtube.com/playlist?list=PLMC9KNkIncKtGvr2kFRuXBVmBev6cAJ2u" --yes-playlist --audio-format mp3 --audio-quality 0 --embed-thumbnail --playlist-end 5 --no-check-certificate`);

    const { code, stdout } = youtubeDl;

    if (code !== 0) {
        shell.echo('Error: youtube-dl command failed');
    }
    resolve(stdout);
  });
};