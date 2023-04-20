const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const app = new Koa()
const path = require('path')
const moment = require('moment')
const { createWorker, createScheduler } = require('tesseract.js');
const fs = require('fs');


router.get('/moreTest', async (ctx) => {
  // 1、开始获取参数
  const { workerNum, fileDir } = ctx.query;

  // 2、将图片文件夹中的图片遍历出来
  const filesName = fs.readdirSync(fileDir, {withFileTypes: 'png'})
  const filesDirArr = filesName.reduce((p, c) =>{
    if (new RegExp(/\.(png|jpg|gif)$/, 'g').test(c.name)){
      p.push(`${fileDir}\\${c.name}`)
    }
    return p;
  }, []);

  // 3、起调度方法，并获得指定数量的worker
  //    备注：这里的workNum不是越多越好，因为启动越多的worker，在createWorker的时候就需要遍历，并挨个创建worker
  //        这就好比你创建很多的worker工人，但是图片没有那么多，前期投入很大，但是没有那么多活需要做，所以尽量保证worker数跟cpu数一样，发挥最大作用 
  const scheduler = createScheduler();
  for (let i = 0; i < workerNum; i++) {
    const worker = createWorker({
      langPath: path.join(__dirname, './lang-data'),
      cachePath: path.join(__dirname),
      logger: m => console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}-${JSON.stringify(m)}`)
      // logger: m => console.log(`${JSON.stringify(m)}`)
    })
    await worker.load()
    await worker.loadLanguage('chi_sim+eng')
    await worker.initialize('chi_sim+eng')
    scheduler.addWorker(worker)
  }

  // 4、异步调用，将这些文件通过Pormise.all同步输出结果，返回OCRres数组，这个数组里每一个text则是最终识别的文本
  const OCRres = await Promise.all(filesDirArr.map((fileDirItem) => (
    scheduler.addJob('recognize', fileDirItem)
  )))
  console.log(OCRres);

  // 5、终止调度任务
  await scheduler.terminate(); // It also terminates all workers.

  // 6、处理识别结果，并返回结果内容
  const res = OCRres.reduce((p, c) => {
    const item = {
      text: c.data.text,
      words: [],
    }
    c.data.words.map((m) => {
      const wordsItem = {text:'', box:{}, confidence:''};
      wordsItem.box = m.bbox;
      wordsItem.text = m.text;
      wordsItem.confidence = m.confidence;
      item.words.push(wordsItem);
    })
    p.push(item);
    return p;
  }, []);
  ctx.body = res;
})

app.use(router.routes(), router.allowedMethods())
app.listen(3002);