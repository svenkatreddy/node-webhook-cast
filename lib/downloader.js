const shell = require('shelljs');
const playlist = process.env.PLAYLIST_TO_DOWNLOAD || 'PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG';

module.exports = (deviceName, options) => {
  return new Promise((resolve, reject) => {
    shell.mkdir('-p','music/older', 'music/current', 'music/temp');
    shell.mv('music/current/*.*','music/temp');
    console.log('Downloading....')
    const youtubeDl = shell.exec(`youtube-dl --download-archive music/current/archive.txt -4icwxo "music/current/%(playlist_index)s - %(title)s.mp3"  "https://www.youtube.com/playlist?list=${playlist}" --yes-playlist --audio-format mp3 --audio-quality 0 --embed-thumbnail --playlist-end 10 --sleep-interval 180 --no-check-certificate --user-agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"`);

    const { code, stdout } = youtubeDl;

    if (code !== 0) {
        shell.mv('music/temp/*.*','music/current');
        shell.echo('Error: youtube-dl command failed');
    } else {
      shell.mv('music/temp/*.*','music/older');
    }
    resolve(stdout);
  });
};