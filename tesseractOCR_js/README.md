# node.js + Tesseract.js + opencv  

## 项目简介 

### 一、singleThread.js：  

1、简介：
*   通过tesseract.js单线程实现OCR文字识别，并将文本输出到output/SingleThreadRes.txt中。   

2、场景：
*   用来解决将图片内容转换成普通文本输出     

### 二、moreThreads.js：  

1、简介：
*   通过tesseract.js多线程批量实现OCR文字识别（建议workers数量跟cpu核心数保持一致），并将多个结果通过http请求返回给调用者    

2、场景：
*   a、用来解决多张图片内容转换成普通文本输出（比单线程要快，具体结果可看./images/多线程运行效率截图文件夹下） 
*   b、可通过调接口的方式，在特定时间下远程调用OCR识别（注意因接口相应时间过长，注意http注入的风险）   

### 三、singleThread_wordBoxes.js：  

1、简介：
*   通过tesseract.js + openCV(opencv4nodejs)方式，将图片文字信息和文字位置识别出来，并通过openCV的方式将图片按照   

2、场景：
*   a、RPA中捕获元素并非常规元素，无法捕获到，可通过这种方式快速定位到指定文字位置后，并进行无目标点击  
*   b、将文字识别出来后，若发现有些字体识别误差过大，可通过标识的方框快速定位，可通过tesseractOCR自带的训练模型进行训练，提高识别度     
*   c、可为后续知道字符坐标进行裁剪。   



## 功能实现目录  

```bash 

文件树状图如下：

├───images  #解析的图片位置
├───lang-data   #所需要的语言
├───node-modules    #npm包
├───moreThreads.js  #多线程OCR识别
├───singleThread_wordBoxes.js   #单线程OCR识别，输出文字位置并框出文字
├───singleThreads.js    #单线程OCR识别
└───output  #singleThread_wordBoxes识别的图片将文字框出后输出的新图片路径


```



## 所需环境     

### 一、安装

1、安装node v14.21.0    
*   node下载： [node下载](https://nodejs.cn/download/)  
*   注意需要设置环境变量在path中

2、安装python环境 
*   需要python环境，本项目无需python代码
*   python下载：[python下载](https://www.python.org/downloads/)
*   注意需要设置环境变量在path中

3、安装VScode、Visual Studio
*   VScode下载：[VScode下载](https://code.visualstudio.com/Download)
*   Visual Studio下载：[Visual Studio下载](https://visualstudio.microsoft.com/zh-hans/downloads/)
*   VScode编写代码工具
*   Visual Studio下载注意有Community免费版和Professional收费版，这里免费版就行，首次下载需要将nodejs、python、c++等插件安装下来（openCV需要c++）

4、安装Cmake
*   Cmake：一款跨平台安装编译器，openCV调用的必备工具之一
*   Cmake下载：[Cmake下载](https://cmake.org/download/)
*   安装请注意不要有中文字符的目录下
*   安装时有自动配置环境变量的选项，请点击，或安装完成后手动配置环境变量

5、安装node-gyp 
*   全局安装：npm install node-gyp -g
*   window系统若无法下载，请在点击win后输入cmd右键进入以管理员身份打开并输入指令

6、安装windows-build-tools
*   windows-build-tools：使用npm安装Windows的C++构建工具，有了这个工具才能使用C++编译程序，请务必完成1、2、3、4、5安装步骤之后，最后一步安装
*   全局安装：npm install --global windows-build-tools      
*   请在点击win后输入cmd右键进入以管理员身份打开并输入全局安装指令
*   如果Visual Studio版本过高，需要npm install --global windows-build-tools --vs2015


### 二、踩坑点
1、报错：Error: Command failed: cmake --version 'cmake' is not recognized as an inter   
*   原因：请检查是否安装好Cmake，并且是否配置好环境变量

2、报错：failed to find vs2017 via powershell: Exception calling "Query" with "0" arg...   
*   原因一：Visual Studio ETW Event Collection Service服务停掉了，可通过Win+R打开运行，输入"services.msc"打开"服务"窗口，找到Visual Studio ETW Event Collection Service将自动启动改为已启动。
*   原因二：Visual Studio可能安装插件的时候有一些问题，则可以在VS的install中选择修复

3、报错：info find-msbuild failed to find vs2017 via powershell: unexpected powershell output 
info find-msbuild attempting to find msbuild via registry query...  
info find-msbuild trying the following msbuild paths:   
info find-msbuild version: 14, path: C:\Program Files (x86)\MSBuild\14.0\bin\msbuild.exe    
info find-msbuild version: 4, path: C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe   
*   原因：npm install --global windows-build-tools安装的版本过高，可以npm install --global windows-build-tools --vs2015进行解决

4、报错：Command failed: node-gyp rebuild --jobs max
*   原因：node版本过高，跟node-gyp不兼容，可以用nvm将管理node版本，将node版本降低
    

## 运行准备


### 一、singleThreads.js脚本运行

1、安装上述1、2步骤 

2、下载离线版tesseractOCR的所需语言包[tessdata语言包下载](https://github.com/naptha/tessdata),并将所需要的语言放到lang-data中（每个语言包对应的哪国语言请对照[各国语言对照表](https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016)）

3、在images下放要识别的图片

4、按照package.json版本，npm i下载所需包

5、node ./singleThread.js，调用singleThreadOCR方法，则在output生成singleThread文件夹，并生成按照图片名字的txt结果为OCR识别的文字结果

### 二、moreThreads.js脚本运行

1、安装上述1、2步骤 

2、下载离线版tesseractOCR的所需语言包[tessdata语言包下载](https://github.com/naptha/tessdata),并将所需要的语言放到lang-data中（每个语言包对应的哪国语言请对照[各国语言对照表](https://tesseract-ocr.github.io/tessdoc/Data-Files#data-files-for-version-400-november-29-2016)）

3、在images下放要识别的图片（注意按照png|jpg|gif后缀结尾）

4、按照package.json版本，npm i下载所需包 

5、node ./singleThread.js，通过调接口http://127.0.0.1:3002/moreThreadsOCR?workerNum=xxx&fileDir=xxx 方式进行调用

## 相关node学习文档

<!-- add docs here for user -->
node安装及官网：[node官网](https://nodejs.cn/) 

egg官网快速开始：[egg 官网](https://www.eggjs.org/zh-CN/)

swagger相关：[swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) 

sequlize相关：[sequlize官网](https://www.sequelize.cn/)  

nodemailer相关：[nodemailer](https://nodemailer.com/about/)  

ouath2相关：[ouath2基本概念](https://zhuanlan.zhihu.com/p/509212673?utm_id=0) 

oauth2-server相关：[oauth2-server](https://www.npmjs.com/package/node-oauth2-server)  

egg-oauth2-server相关：[egg-oauth2-server](https://github.com/Azard/egg-oauth2-server)  

tesseract.js相关：[tesseract.js](https://github.com/naptha/tesseract.js)

opencv4nodejs相关：[opencv4nodejs]https://github.com/justadudewhohacks/opencv4nodejs 

cv相关中文api文档：[cv中文手册]https://github.com/lp970703/node_job/openCV

<!-- 关于swagger和sequlize借鉴下面网址 -->
<!-- (https://www.jianshu.com/p/accbe04a7ffa) -->
<!-- 关于egg-oauth2-server相关借鉴一下网址
(https://www.jianshu.com/p/1fe043a700bf) -->

## 项目启动

```bash
# 进入相关项目文件
$ cd xxx

# 安装依赖
$ npm install  

# 启动项目
$ node ./xxx.js  

```
