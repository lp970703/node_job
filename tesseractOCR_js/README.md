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



## 所需环境  （win10）   

### 一、安装

1、安装node v16.20.0及以上     
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

5、安装windows-build-tools
*   windows-build-tools：使用npm安装Windows的C++构建工具，有了这个工具才能使用C++编译程序，请务必完成1、2、3、4、5安装步骤之后，最后一步安装
*   全局安装：npm install --global windows-build-tools      
*   请在点击win后输入cmd右键进入以管理员身份打开并输入全局安装指令
*   如果Visual Studio版本过高，需要npm install --global windows-build-tools --vs2015

6、安装openCV -V4.6
*   openCV -V4.6下载：[openCV4.6](https://nchc.dl.sourceforge.net/project/opencvlibrary/4.6.0/opencv-4.6.0-vc14_vc15.exe)他需要等待几秒后会弹出下载路径提示
*   按照步骤安装，注意安装路径不要出现中文，特殊字符以及空格（eg：c:\tools\opencv）
*   配置环境变量：需要配置如下变量  

|    环境变量名                               | 	值                                      | 
| ------------------------------------------ | ------------------------------------------  | 
| OPENCV_INCLUDE_DIR                         |  c:\tools\opencv\opencv\build\include       | 
| OPENCV_LIB_DIR                             | 	c:\tools\opencv\opencv\build\x64\vc15\lib  | 
| OPENCV_BIN_DIR                             | 	c:\tools\opencv\opencv\build\x64\vc15\bin  | 
| OPENCV4NODEJS_AUTOBUILD_OPENCV_VERSION     | 	4.6.0                                      | 
| OPENCV4NODEJS_DISABLE_AUTOBUILD            | 	1                                          | 

*   需要在package.json中添加如下： 

```bash 
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "install_arm64": "build-opencv --version 4.6.0 --flag=\"-DCMAKE_SYSTEM_PROCESSOR=arm64 -DCMAKE_OSX_ARCHITECTURES=arm64\" build",
    "install_4.6.0_cuda": "build-opencv --version 4.6.0 --flags=\"-DWITH_CUDA=ON -DWITH_CUDNN=ON -DOPENCV_DNN_CUDA=ON -DCUDA_FAST_MATH=ON\" build",
    "do-install": "build-opencv build"
  },
  "opencv4nodejs": {
    "disableAutoBuild": 1,  #自动build，无需手动编译openCV文件
    "opencvIncludeDir": "C:\\tools\\opencv\\opencv\\build\\include",
    "opencvLibDir": "C:\\tools\\opencv\\opencv\\build\\x64\\vc15\\lib",
    "opencvBinDir": "C:\\tools\\opencv\\opencv\\build\\x64\\vc15\\bin",
    "autoBuildOpencvVersion": "4.6.0"
  }
```


7、安装node-gyp 
*   全局安装：npm install node-gyp -g
*   window系统若无法下载，请在点击win后输入cmd右键进入以管理员身份打开并输入指令

8、安装opencv4nodejs相关（管理员模式）
*   npm install --save opencv4nodejs
*   npm i @u4/opencv4nodejs -g
*   npm link
*   安装后重启VScode终端

9、项目中安装@u4/opencv4nodejs
*   进入指定项目中，输入npm install -S @u4/opencv4nodejs将全局的@u4/opencv4nodejs复制到项目中去，这样不需要重新编译了
*   执行脚本npm run install_arm64(通过u4/opencv4nodejs将opencv进行build，注意这个是win10的64位运行的指令)
*   执行脚本npm run install_4.6.0_cuda(同样生成build)
*   上述指令参考github网址[@u4/opencv4nodejs](https://github.com/UrielCh/opencv4nodejs)

10、使用

```bash
const cv = require('@u4/opencv4nodejs');
```


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
if not defined npm_config_node_gyp (node "D:\Environment\nvm\nvm\v14.21.0\node_modules\npm\node_modules\npm-lifecycle\node-gyp-bin\\..\..\node_modules\node-gyp\bin\node-gyp.js" rebuild --jobs max )  else (node "D:\Environment\nvm\nvm\v14.21.0\node_modules\npm\node_modules\node-gyp\bin\node-gyp.js" rebuild --jobs max )
*   原因：node版本跟node-gyp不兼容，可以用nvm将管理node版本，将node版本降低或增高（我这里用的14版本过低）
*   版本说明：  请按照以下版本安装  

|    软件包   | 	版本          | 
| ---------- | ----------------  | 
| node       |  >= 16.0.0        | 
| python     | 	>= 3.8 & <=3.10  | 
| cmake      | 	3.26.0           | 
| opencv     | 	>= 4.6           | 

5、报错：Uncaught Error Error: Cannot find module 'D:\Code\node\tesseractOCR_js\node_modules\opencv4nodejs\build\Release\opencv4nodejs' Require stack:   
-D:\Code\node\tesseractOCR_js\node_modules\opencv4nodejs\lib\cv.js  
-D:\Code\node\tesseractOCR_js\node_modules\opencv4nodejs\lib\opencv4nodejs.js   
-D:\Code\node\tesseractOCR_js\singleThread_wordBoxes.js 
*   原因：opencv4nodejs没有找到编译后的目录，需要执行一、安装中第9步，npm run install_arm64和install_4.6.0_cuda

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





##  小结    

1、如何以管理员身份打开某个路径的文件
*   进入路径C:\Windows\System32，将[cmd.reg]https://github.com/lp970703/node_job/Environment/guanliyuan_setting文件放到目录下保存
*   到想要管理员权限打开cmd窗口的文件，右击出现Open cmd here as Admin点击就可以打开了。

2、使用nvm控制node版本
*   安装nvm[nvm](https://github.com/coreybutler/nvm-windows/tags)
*   编辑环境变量，在"我的电脑"右键"属性"-"高级系统设置"-"高级"-"环境变量",新增如下变量（安装应注意避免中文、空格路径、cmd窗口要以管理员身份）
```bash
NVM_HOME = d:\nvm    
NVM_SYMLINK = d:\Program Files\nodejs
Path = %NVM_HOME%;%NVM_SYMLINK%
```
*   通过nvm指令下载：nvm install x.x.x(x.x.x位版本号)
*   常用nvm指令：
```bash
    nvm -v                      #查看nvm版本
    nvm use 16.20.0             #使用16.20.0版本的node
    nvm install x.x.x           #下载指定node版本
    nvm ls                      #查看当前使用node版本以及目前下载的node版本
    npm cache clean --force     #切换版本建议在npm i时先清除一下cache
```

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

opencv4nodejs相关：[opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs) 

@u4/opencv4nodejs相关：[@u4/opencv4nodejs](https://github.com/UrielCh/opencv4nodejs)

opencv4nodejs安装全过程：[opencv4nodejs安装](https://www.jianshu.com/p/82f2dbff59d9)

cv相关中文api文档：[cv中文手册](https://github.com/lp970703/node_job/openCV)

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
