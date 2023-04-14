/**
 * 该脚本主要将视频软件切换成无损画质文件（主要看传参），本代码实例依靠FFmpeg+node批量将mp4格式转换成mp3格式
 * 1、先将视频文件导入到mp4File文件中
 * 2、新建mp3File文件
 * 3、将原始文件的路径，原始文件的风格（即文件后缀名，支持mov,mp4,m4a,3gp,3g2,mj2等视频格式）,目标保存路径，目标格式四个参数写入到mp4Tomp3方法中去即可
 * 4、运行脚本等待输出结果
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * 
 * @param {*} param 
 * @param {string} param.originDir 原始文件路径
 * @param {string} param.originFormat 原始文件风格（可选mp4等等）
 * @param {string} param.targetDir 目标文件路径
 * @param {string} param.targetFormat 目标文件风格（可选mp3等等）
 */
const mp4Tomp3 = async ({originDir, originFormat, targetDir, targetFormat}) => {
  let files = fs.readdirSync(originDir);
  let errorNum = 0;
  let errorItemName = ''
  files.forEach(async (file) => {
    const fileLastName = file.substring(file.lastIndexOf('.') + 1);
    const filefistName = file.substring(0, file.lastIndexOf('.'))
    if (fileLastName === originFormat) {
      // 简单解释一下：
      // -i 传入的mp4路径    -vn保留原视频，不对原始平做处理    -ar采样率（22050, 441000, 48000）    -ac声道数    -b:a比特率（也可以用ab来代替。mp3有96k, 128k, 192k, 256k, 320k）    -f转成的格式（默认也会是mp3这种自动
      // ffmpeg.exe -i xxx.mp4 -vn -ar 44100 -ac 2 -b:a 192k -f mp3 xxx.mp3
      try {
        console.log(`---开始将名为《${filefistName}》的${fileLastName}文件类型转换为${targetFormat}类型---`);
        await exec(`ffmpeg -i ${originDir}\\${filefistName}.${originFormat} -vn -ar 44100 -ac 2 -b:a 192k -f mp3 ${targetDir}\\${filefistName}.${targetFormat}`)
        console.log(`------已完成对《${filefistName}》的${fileLastName}文件类型进行转换------`);
      } catch (error) {
        errorNum++;
        errorItemName = `${errorItemName}《${file}》`
        console.error(`***《${filefistName}》转换失败***`)
        console.log(error)
      }
    }
  })
}

mp4Tomp3({
  originDir: path.join(__dirname, 'mp4File'),
  originFormat: 'mp4',
  targetDir: path.join(__dirname, 'mp3File'),
  targetFormat: 'mp3'
})