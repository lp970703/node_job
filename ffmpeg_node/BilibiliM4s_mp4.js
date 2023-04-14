/**
 * 该脚本主要做了将bilibiliFile（B站）中的缓存视频M4S文件转化为普通的mp4文件（node+FFmpeg）
 * 
 * 1、FFmpeg是开源的解决视频、音频相互转码的工具
 *  （1）github地址：https://github.com/FFmpeg/FFmpeg
 *  （2）安装包：./FFmpeg安装包（该安装包是win系统）
 *  （3）运行此脚本，请先安装FFmpeg的插件（直接把（2）解压至电脑，再把这个目录配置到环境变量中去），并配置到电脑的环境变量中去
 *  （4）验证是否安装成功FFmpeg（cmd窗口输入FFmpeg version，出现有数据则安装成功）
 * 2、找到手机缓存的B站的视频，路径./Android/data/tv.danmaku.bili/download
 * 3、将B站缓存视频download文件下的所有文件放到bilibilifile文件夹下
 * 4、调用bilibiliVideoCache2Mp4Wrap方法，输入参数后方可实现
 */

// bilibili中m4s缓存文件转换成mp4文件
// bilibili手机中保存的地址：./Android/data/tv.danmaku.bili/download

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * 创建要转换mp4的文件夹
 * @param {*} targetPath 
 * @returns 
 */
const mkdirSync = async (targetPath) => {
  try {
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath)
    } 
  } catch (error) {
    console.log(error);
  }
}

/**
 * 利用FFmpeg通过创建子进程去操作，将audio.m4s和video.m4s文件转化为mp4文件
 * @param {*} output 输出的文件夹路径
 * @param {*} curDirPath 当前递归目录位置（一层一层找entry.json的数据） 
 * @param {*} isTarget 是否找到了需要转换成mp4的目标文件夹
 * @param {*} outputFileName 转换成mp4的视频名(通过entry.json拿到原来视频的名字)
 * @param {*} dir 整个视频合集文件夹的名字
 */
const bilibiliVideoCache2Mp4 = async ({output, curDirPath, isTarget, outputFileName, dir}) => {
  if (isTarget) {
    /* 
    使用replace去除空格不然ffmpeg会报错(eg:Unable to find a suitable output format for 'XXX')
    这里需要注意targetPath和outputFileName不应该有特殊的字符比如【 】，不然ffmpeg也会报错(eg:Unable to find a suitable output format for 'XXX')
    */
    let dirName = dir.replace(new RegExp(/[\\\\/:*?\"<>|\s]/,'g'), '');
    let targetPath = `${output}\\${dirName}`
    await mkdirSync(targetPath)
    outputFileName = outputFileName?.replace(new RegExp(/[\\\\/:*?\"<>|\s]/,'g'), '') // 有可能不存在，因为else调用bilibiliVideoCache2Mp4方法的时候没有传outputFileName,所以要outputFileName?判断是否存在
    try {
      console.log(`---开始将名为《${outputFileName}》的音频、视频文件合并输出成mp4文件---`)
      await exec(`ffmpeg -i ${curDirPath}\\video.m4s -i ${curDirPath}\\audio.m4s -codec copy ${targetPath}/${outputFileName}.mp4`)
      console.log(`------已完成对《${outputFileName}》文件的合成------`)
    } catch (error) {
      console.error(`***《${outputFileName}》文件转换失败***`)
      console.log(error.stderr);
    }
    return
  }
  let files = fs.readdirSync(curDirPath);
  files.forEach(function (file) {
    let stat = fs.statSync(curDirPath + '/' + file)
    // stat.isDirectory()判断路径是否存在
    if (stat.isDirectory()) {
      // 文件夹名字如果是80的话，说明已经到了目标文件夹audio.m4s和video.m4s就在里面
      // 判断是否能读到文件entry.json的文件
      let videoInfojson = {};
      try {
        videoInfojson = JSON.parse(fs.readFileSync(path.join(curDirPath, 'entry.json'), 'utf-8'));
      } catch (error) {
        console.log(`${curDirPath}目录下未找到entry.json文件,将继续递归继续找子文件`);
      }
      if (Object.keys(videoInfojson).length > 0) {
        // json.page_data.part是这组视频的名字，json.title是单个视频的名字
        bilibiliVideoCache2Mp4({ 
          output, 
          curDirPath: path.join(curDirPath, file), 
          isTarget: true, 
          outputFileName: videoInfojson.page_data?.part ? videoInfojson.page_data.part : videoInfojson.time_create_stamp.toString(), // 没有文件名字就去那下载视频的时间戳当名字
          dir: videoInfojson.title 
        })
      }
      else bilibiliVideoCache2Mp4({ 
        output, 
        curDirPath: path.join(curDirPath, file) 
      })
    }
  });
}

/**
 * 执行转换的管道
 * @param {*} entry 当前递归目录位置（这里是bilibiliFile文件夹）
 * @param {*} output 创建新的文件夹
 */
async function bilibiliVideoCache2Mp4Wrap(entry, output) {
  await mkdirSync(output);
  bilibiliVideoCache2Mp4({
    curDirPath: entry,
    output,
  })
}

bilibiliVideoCache2Mp4Wrap(path.join(__dirname, 'bilibiliFile'), path.join(__dirname, 'bilibiliFile_outMP4'))

