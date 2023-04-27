const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const cv = require("@u4/opencv4nodejs")

/**
 * 一、生成要保存文字识别的文件
 * 
 * @param {*} targetPath 
 */
const mkdirSync = async (targetPath) => {
  try {
    if(!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * 二、创建在指定文件夹下读到的图片类型复制到trainPhotoDir（训练图片路径）下，并将他们的后缀名修改为.tif
 * 
 * @param {*} originPhotoDir  需要训练的图片路径
 */
const createOriginFile = async (originPhotoDir) => {
  const trainPhotoDir = `${originPhotoDir}\\trainPhotoDir`;
  await mkdirSync(trainPhotoDir);
  const filesData = fs.readdirSync(originPhotoDir)
  for (const file of filesData) {
    if (new RegExp(/.png/, 'g').test(file)){
      const beforeCopyName = `${originPhotoDir}\\${file}`;
      const afterCopyName = `${trainPhotoDir}\\${file}`;
      fs.copyFileSync(beforeCopyName, afterCopyName);
    }
  }
  return trainPhotoDir;
}

/**
 * 三、处理生成的tiff文件的名字
 * 规则：[lang].[fontname].exp[exp].tif，其中lang为语言名称，fontname为字体名称，exp为序号；在tesseract中，一定要注意格式
 * 
 * @param {*} trainPhotoDir 将训练的图片放到新的路劲下
 * @param {*} mergeNameObject 生成训练文件的信息
 * @returns 
 */
const handleMergeData = async(trainPhotoDir, mergeNameObject) => {
  // mergeCompleteName = [lang].[fontname].exp[exp].tif，其中lang为语言名称，fontname为字体名称，exp为序号；在tesseract中，一定要注意格式
  const mergeCompleteName = `${mergeNameObject.lang}.${mergeNameObject.fontname}.exp${mergeNameObject.exp}.tiff`;

  // mergeName = mergeCompleteName不加后缀名
  const mergeName = `${mergeNameObject.lang}.${mergeNameObject.fontname}.exp${mergeNameObject.exp}`;
  const panFu = trainPhotoDir.split(':')[0];
  const cmdGotoDir = `${panFu}: && cd ${trainPhotoDir}`;
  return {
    mergeCompleteName, 
    mergeName, 
    panFu, 
    cmdGotoDir, 
    mergeNameObject,
  }
}

/**
 * 四、根据tiff图片集合，生成.box文件
 * @param {*} cmd 
 * @returns 
 */
const cmdLanguagesOne = async (cmd) => {
  // 1、通过tesseract生成box后缀文件
  const cmdOrderOne = `${cmd.cmdGotoDir} && tesseract ${cmd.mergeCompleteName} ${cmd.mergeName} -l ${cmd.mergeNameObject.language} batch.nochop makebox`;
  return cmdOrderOne;
}

/**
 * 五、将调教好的.box文件，用cmd窗口指令并结合tesseract去生成训练后的语言文件
 * @param {*} cmd 
 * @returns 
 */
const cmdLanguagesTwo = async (cmd) => {
  // 1、生成font_properties文件（该文件没有后缀名）
  const orderOne = `${cmd.cmdGotoDir} && echo ${cmd.mergeNameObject.fontname} 0 0 0 0 0 >font_properties`;
  // 2、生成.tr训练文件
  const orderTwo = `${cmd.cmdGotoDir} && tesseract ${cmd.mergeCompleteName} ${cmd.mergeName} nobatch box.train`;
  // 3、生成字符集文件
  const orderThree = `${cmd.cmdGotoDir} && unicharset_extractor ${cmd.mergeName}.box`;
  // 4、生成shape文件
  const orderFour = `${cmd.cmdGotoDir} && shapeclustering -F font_properties -U unicharset -O ${cmd.mergeNameObject.lang}.unicharset ${cmd.mergeName}.tr`;
  // 5、生成聚字符特征文件（会生成 inttemp、pffmtable、shapetable和demo.unicharset四个文件）
  const orderFive = `${cmd.cmdGotoDir} && mftraining -F font_properties -U unicharset -O ${cmd.mergeNameObject.lang}.unicharset ${cmd.mergeName}.tr`;
  // 6、生成字符正常化特征文件（生成 normproto 文件）
  const orderSix = `${cmd.cmdGotoDir} && cntraining ${cmd.mergeName}.tr`;
  // 7、文件重命名（重新命名inttemp、pffmtable、shapetable和normproto这四个文件的名字为[lang].xxx）
  const orderSeven = `${cmd.cmdGotoDir} && rename normproto ${cmd.mergeNameObject.lang}.normproto`
  const orderEight = `${cmd.cmdGotoDir} && rename inttemp ${cmd.mergeNameObject.lang}.inttemp`
  const orderNine = `${cmd.cmdGotoDir} && rename pffmtable ${cmd.mergeNameObject.lang}.pffmtable`
  const orderten = `${cmd.cmdGotoDir} && rename shapetable ${cmd.mergeNameObject.lang}.shapetable`
  const orderEleven = `${cmd.cmdGotoDir} && rename unicharset ${cmd.mergeNameObject.lang}.unicharset`
  // 8、合并训练文件
  const ordertwelve = `${cmd.cmdGotoDir} && combine_tessdata ${cmd.mergeNameObject.lang}.`
  return [orderOne, orderTwo, orderThree, orderFour, orderFive, orderSix, orderSeven, orderEight, orderNine, orderten, orderEleven, ordertwelve]
}

/**
 * 六、主函数
 * 规则：按照下列序号执行，人工的步骤需要做完之后才可以做下面的内容
 * @param {*} param0 
 */
const main = async ({originPhotoDir, mergeNameObject}) => {
  // 1、将需要导出文件放到新建的目录中去。
  const trainPhotoDir = await createOriginFile(originPhotoDir);
  // 2、处理mergeNameObject数据
  const cmd = await handleMergeData(trainPhotoDir, mergeNameObject);

  // 3、（人工）打开Tools -> Merge TIFF选项，将这些png图片，通过jTessBoxEditor工具转换成tiff格式的图片集合————————目前暂时还没开发出自动转成tiff格式图片，可以转成单张图片，但是批量转成一起比较困难

  // 4、将合成的tiff一份文件，按照传参mergeNameObject的格式，通过tesseract指令生成box文件
  const cmdOrderOne = await cmdLanguagesOne(cmd)
  const res = await exec(cmdOrderOne);
  console.log(res.stderr);

  // 5、（人工）打开jTessBoxEditor，选择Box Editor -> open选项，进行训练，训练结束点击save保存（ctrl+s）


  // 6、在cmd窗口下依次完成生成的脚本，并最终生成已traineddata为后缀的文件
  const cmdOrderTwo = await cmdLanguagesTwo(cmd)
  for (let i=0; i<cmdOrderTwo.length; i++) {
    try {
      const cmdOrder = cmdOrderTwo[i];
      console.log(`要执行的语句：****************${cmdOrder}`)
      const res = await exec(cmdOrder);
      console.log(`====== 第${i}条指令结果:  ======`);
      console.log(res.stdout)
    } catch (error) {
      console.log(`****** 第${i}条指令异常结果:  ******`);
      console.error(res.stderr);
    }  
  }
  // 7、（人工）将生成的文件放到跟chi_sim或eng文件同级目录下，使用ocr识别的时候在loadLanguage方法添加该语言即可
}


main({
  originPhotoDir: path.join(__dirname, './trainPhoto'),
  mergeNameObject: {
    lang: 'words',
    fontname: 'taobaoShop',
    exp: 0,
    language: 'chi_sim'
  }
})