const screenshot = require('screenshot-desktop')
const schedule = require('node-schedule')
const fs = require('fs')
const moment = require('moment')
const path = require('path')

//每小时的 0分钟截图
console.log('waitting screen shot.')
var j = schedule.scheduleJob('0 41 * * * *',function(){
   //截图
   screenshot().then(
       (img) => {
           var p = path.join(__dirname,moment().format('YYYYMMDD-HHmmss.jpg'))
           fs.writeFile(p,img,function(err){
               if(err){
                   throw err
               }
           })
           console.log('screenshot success to '+ p)
       }
   )
})
