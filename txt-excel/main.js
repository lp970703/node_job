const util = require('util');
const exec = util.promisify(require('child_process').exec);
const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');


async function main() {
    const inModelfilePath = path.join('D:\\Project\\MySelf\\node_job\\txt-excel\\in\\videoFileURL.txt'); // 输入文件的路径
    const inExcelFilePath = path.join('D:\\Project\\MySelf\\node_job\\txt-excel\\in\\立邦需要下载的课件.xlsx'); // 输入文件的路径

    const indataStr = fs.readFileSync(inModelfilePath, 'utf8');
    // txt的模板
    const modeldata = indataStr.split('\n')
    // excel的模板
    const inExcelData = xlsx.parse(inExcelFilePath)[0].data;
    let outExcel = [{
        name: "sheeet1",
        data: [inExcelData[0]]
    }]
    let mustColsLength = 2; // 最长的列
    for (let i = 1; i < inExcelData.length; i++) {
        let outItemData = inExcelData[i];
        let targetItem = inExcelData[i][0];
        let colsLength = 0;
        for (let y = 0; y < modeldata.length; y+=2) {
            if(modeldata[y].match(targetItem)) {
                colsLength++;
                const modelItemName = modeldata[y].split("|");
                outItemData.push(modelItemName[0]);
                outItemData.push(`id=${modelItemName[1]}`);
                outItemData.push(modeldata[y+1])
            }
        }
        mustColsLength > colsLength ? mustColsLength = mustColsLength : mustColsLength = colsLength;
        outExcel[0].data.push(outItemData);

    }
    const timer = new Date().getTime();
    const colsWch = {wch: 60};
    const colsOptions = [];
    for(let z=0; z<mustColsLength;z++) {
        colsOptions.push(colsWch);
    }
    const sheetOptions = {'!cols': colsOptions}; //设置宽度
    const outDataPath = path.join(`D:\\Project\\MySelf\\node_job\\txt-excel\\out\\${timer}.xlsx`);
    let buffer = xlsx.build(outExcel, {sheetOptions});
    fs.writeFileSync(outDataPath, buffer)
    console.log("==========完成了============")
}
main();





