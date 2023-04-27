const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const fileArr = fs.readdirSync(path.join(__dirname, './test'))
let tiffData = [];

for (const file of fileArr) {
  if(new RegExp(/.png/, 'g').test(file)) {
    const fileName = path.join(__dirname, `./test/${file}`)
    const fileShortName = file.split('.png')[0];
    sharp(fileName)
      .tiff()
      .toFile(`./test/${fileShortName}.tiff`)
    tiffData.push({
      input: path.join(__dirname, `./test/${fileShortName}.tiff`)
    });
  }
}
