/**
 * 一、功能
 * 1、单线程执行ocr文字识别
 * 2、并将文字坐标显示出来以及
 *  （1）tesseractBOX：该坐标位tesseract自带坐标，跟现在的x、y轴类似，
 *                    规则：从图片左上角位x、y轴原点，自左向右：x轴变大；自上而下，y轴变大。
 *  （2）opencvBOX：该坐标为opencv的坐标规定，从图片左上角为原点
 * 3、将文字用方盒子包住，利用opencv给图片文字画框。
 */
const { createWorker } = require('tesseract.js');
const path = require('path');
const moment = require('moment');
const cv = require('@u4/opencv4nodejs');
const { Rect, Point2 } = require('opencv4nodejs');

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
 * 3、利用opencv将字符标定
 * @param {*} param 参数
 * @param {*} param.targetPhotoDir 要识别的路径地址
 * @param {*} param.wordsPosition 图片中文字位置
 * @param {*} param.outputPhotoDir 将画框的图片输出的路径
 * 
 */
const handlePhoto = async ({targetPhotoDir, wordsPosition, outputPhotoDir}) => {

  // 1、读取img图像
  // cv.imread(targetPhotoDir)返回了一个Mat对象，下面的cvtColor()、drawRectangle()等方法都是Mat对象下的方法
  let img = cv.imread(targetPhotoDir);

  // 2、将cv读取的默认格式BGR改为跟tesseract一样的RGB格式
  // img = cv.cvtColor(img, cv.COLOR_BGR2BGR555);   //python写法
  img.cvtColor(cv.COLOR_BGR2BGR555);

  // 3、遍历将wordsPosition的文字框出来
  for (const item of wordsPosition) { 

    // 这里面Rect(x: number, y: number, width: number, height: number)对象四个参数分别指的是：
    // x -> 左上角原点，从左往右依次增大的像素位置；  y -> 左上角为原点，从上到下依次增大的像素位置； width -> 以x,y为原点，再往右偏移为正值的坐标值；  height -> 以x,y为原点，再往下偏移为正值的坐标值；
    // new cv.Rect(item[1], item[2], item[3]-item[1], item[4]-item[2]) === new cv.Point2(item[1], item[2]), new cv.Point2(item[3], item[4]) // 两种写法，都表示框住的坐标
    img.drawRectangle(new cv.Rect(item[1], item[2], item[3]-item[1], item[4]-item[2]), new cv.Vec3(0, 255, 0), 1, cv.LINE_4);

    // cv.rectangle(img, (item[1],item[2]), (item[3],item[4]), (0,0,255), 2)  //python写法
    cv.imwrite(outputPhotoDir, img);
  }
  // cv.waitKey()监听键盘事件的方法，参数是多少ms（毫秒）
  cv.waitKey(0);
}

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


/**
 * 4、main：主函数
 * @param {*} param 
 * @param {*} param.targetPhotoDir 要识别的路径地址
 * @param {*} param.languages 图片中存在的语言
 * @param {*} param.outputPhotoDir 将画框的图片输出的路径
 * 
 */
const main = async ({targetPhotoDir, languages, outputPhotoDir}) => {
  // 1、输出文字位置
  const wordsPosition = await outPosition({targetPhotoDir, languages});
  // 2、通过文字位置，用opencv将文字位置用方框标出
  await handlePhoto({targetPhotoDir, wordsPosition, outputPhotoDir});
}



// 方法调用
main({
  targetPhotoDir: path.join(__dirname, './images/taobaoShop1.png'),
  languages: 'chi_sim+eng',
  outputPhotoDir: path.join(__dirname, './output/singleThread_wordBoxes/taobaoShop1Res.png')
})