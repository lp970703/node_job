const util = require('util');
const exec = util.promisify(require('child_process').exec);
const schedule = require('node-schedule');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

console.log('定时任务已开启');

// '30 * * * * *'测试每30秒清理一次
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ 一周的星期 (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── 月份 (1 - 12)
// │    │    │    └────────── 月份中的日子 (1 - 31)
// │    │    └─────────────── 小时 (0 - 23)
// │    └──────────────────── 分钟 (0 - 59)
// └───────────────────────── 秒 (0 - 59, OPTIONAL)
schedule.scheduleJob('0 44 * * * *', async function(){
  let oneMonth = 2505600000; // 30天有的毫秒数
  let threeMonth = 7516800000; // 90天有的读秒数
  console.log('=====开始清理=====');
  let nowTimestamp = moment().valueOf();
  console.log(`当前时间戳：======>${nowTimestamp}`);
  console.log(`当前时间：======>${new Date()}`)
  let clearTimestamp = nowTimestamp - threeMonth;
  // const filePath = path.join(__dirname, '../testLog');
  const filePath = path.join('C:\\Users\\卢鹏\\AppData\\Roaming\\EasyPie\\log\\prorunLogs'); // 输入文件的路径
  const files = fs.readdirSync(filePath)

  for (file of files) {
    let fileTimestamp = file.split('-')[0];
    let fileTimestampToNum = Number.parseInt(fileTimestamp);
    if(clearTimestamp > fileTimestampToNum) {
      // let delPath = `del C:\\Users\\卢鹏\\Desktop\\日志\\prorunLogs\\a\\${logName}.log`;
      let delPath = `del ${filePath}\\${file}`;
      console.log(`要清理的路径：======>${delPath}`);
      await lsdelPathFile(delPath);
    }
  }

  console.log('======清理结束======');
});

/**
 * 清理日志进程
 * @param {String} delPath 日志路径
 */
async function lsdelPathFile(delPath) {
  try {
    const findDelPath = await exec(delPath);
    console.log(findDelPath.stdout);
  } catch (error) {
    console.log(error.stderr)
  }
}



