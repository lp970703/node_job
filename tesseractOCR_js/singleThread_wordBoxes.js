/**
 * 一、功能
 * 1、单线程执行ocr文字识别
 * 2、并将文字坐标显示出来以及
 *  （1）tesseractBOX：该坐标位tesseract自带坐标，跟现在的x、y轴类似，
 *                    规则：从图片左下角位x、y轴原点，自左向右：x轴变大；自下而上，y轴变大。
 *  （2）opencvBOX：该坐标为opencv的坐标规定，从图片左上角为原点
 * 3、将文字用方盒子包住
 */
const { createWorker } = require('tesseract.js');
const path = require('path');
const moment = require('moment');

/**
 * 1、createWorker：起一个线程worker去处理OCR识别
 */
const worker = createWorker({
  langPath: path.join(__dirname, './lang-data'), 
  cachePath: path.join(__dirname),
  logger: m => console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}-${JSON.stringify(m)}`)
});


/**
 * 2、tesseractOCR：调用tesseract.js，将OCR文字信息获取出来
 * @param {*} param 参数
 * @param {*} param.targetPhotoDir 要识别的路径地址
 * @param {*} param.languages 图片中存在的语言
 * @returns 返回OCR识别信息
 */
const tesseractOCR = async ({targetPhotoDir, languages}) => {
  await worker.load();

  // 加载语言
  await worker.loadLanguage(languages);

  // 初始化
  await worker.initialize(languages);

  // 识别
  const { data } = await worker.recognize(targetPhotoDir);

  // detect():输出ocr的基本结果
  //  结果：data2 = { data: {orientation_confidence //方向_置信度;  orientation_degrees //方位_度;  script_confidence //脚本可信度} jobId //工作id }
  // const data2 = await worker.detect(path.join(__dirname, './images/b.png'))
  // console.log(`detect执行后的${data2}`)

  // 终止
  await worker.terminate();
  return data;
};


/**
 * 3、outPosition：通过tesseractOCR方法，提炼出每个字的具体位置
 * @param {*} param 参数
 * @param {*} param.targetPhotoDir 要识别的路径地址
 * @param {*} param.languages 图片中存在的语言
 * @returns 返回OCR文字字符位置信息
 */
const outPosition = async ({targetPhotoDir, languages}) => {
  const OCRres = await tesseractOCR({targetPhotoDir, languages});
  console.log(`recognize执行后的${OCRres}`);

  // 1、将tesseract输出的结果中words词汇进行遍历，并将x0,y0,x1,y1坐标洗出来
  const wordsPosition = OCRres.words.reduce((p, c) => {
    const item = [c.text, c.bbox.x0, c.bbox.y0, c.bbox.x1, c.bbox.y1];
    p.push(item);
    return p;
  }, []);
  return wordsPosition;
}


outPosition({
  targetPhotoDir: path.join(__dirname, './images/火车票.png'),
  languages: 'chi_sim+eng'
})