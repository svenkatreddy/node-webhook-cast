const fs = require('fs');
const path = require('path');

module.exports = () => {
  var dirPath = path.resolve(__dirname, '../music/current/');
  var filesList = [];
  const files = fs.readdirSync(dirPath);
  const fileNames = files.filter(function(e){
    return (!path.extname(e).toLowerCase().includes('temp')) && path.extname(e).toLowerCase() === '.mp3'
  });
  fileNames.forEach(fileName => {
    filesList.push(path.resolve(__dirname, '../music/current/', fileName))
  });
  console.log(filesList);
  return filesList;
};
