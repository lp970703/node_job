# ffmpeg_node 
1、批量实现B站缓存视频m4s格式转换成mp4格式 

2、批量实现从mp4模式提取音频至mp3模式 



## 功能实现目录  

```bash 

文件树状图如下：

│   BilibiliM4s_mp4.js      #B站m4s文件转换为mp4脚本
│   mp4_mp3.js      #mp4文件转换为mp3脚本
│   mp4_mp3备份(已弃用forEach同步代码块不好监听加载完毕).js     #已弃用
│   
├───.vscode     #vscode启动
│       launch.json
│       
├───bilibiliFile    #B站下载文件（手机端保存地址./Android/data/tv.danmaku.bili/download）
│   ├───354331703
│   │   └───c_1077410246
│   │       │   danmaku.xml
│   │       │   entry.json
│   │       │   
│   │       └───80
│   │               audio.m4s     #音频m4s文件
│   │               index.json
│   │               video.m4s     #视频m4s文件
│   │               
│   ├───818008012
│   │   └───c_902403900
│   │       │   danmaku.xml
│   │       │   entry.json
│   │       │   
│   │       └───80
│   │               audio.m4s
│   │               index.json
│   │               video.m4s
│   │               
│   └───s_26015
│       └───730004
│           │   danmaku.xml
│           │   entry.json
│           │   
│           └───16
│                   audio.m4s
│                   index.json
│                   video.m4s
│                   
├───bilibiliFile_outMP4     #B站转换成mp4文件路径
│           
├───FFmpeg安装包      #FFmpeg安装包（win64）
│       ffmpeg-master-latest-win64-gpl-shared.zip
│       
├───mp3File     #转换后的mp3文件位置
│       JISOO-‘FLOWER’MV.mp3
│       SongListDir.txt
│       
└───mp4File     #将要转换的mp4文件位置
        JISOO-‘FLOWER’MV.mp4

```


## 运行准备

### 一、BilibiliM4s_mp4.js脚本运行

1、安装FFmpeg  
    （1）解压FFmpeg安装包到本地  
    （2）配置环境变量（将安装包到bin目录的路径配置到系统变量path中）  
    （3）cmd窗口输入ffmpeg -version看是否安装成功  

2、找到手机缓存的B站的视频，路径./Android/data/tv.danmaku.bili/download  

3、将B站缓存视频download文件下的所有文件放到bilibilifile文件夹下 

4、node ./BilibiliM4s_mp4.js，调用bilibiliVideoCache2Mp4Wrap方法，输入参数后方可实现 

### 二、mp4_mp3.js脚本运行

1、将要导出的mp4文件放到mp4File路径下 

2、新建mp3File路径，用来保存mp3保存格式的目录

3、在mp4Tomp3函数中输入指定参数（除mp4转mp3以外，还支持mov,mp4,m4a,3gp,3g2,mj2等视频格式可以转mp3）

4、node ./mp4_mp3.js 调用mp4Tomp3方法，输入参数后方可实现

5、运行结束后会生成SongListDir用来记录运行结果

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
