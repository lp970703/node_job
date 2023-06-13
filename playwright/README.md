# playwright
关于playwright自动化测试框架的demo


## 功能实现目录(链接对应文件夹名称)
*   [demo01](https://github.com/lp970703/node_job/tree/master/playwright/demo01):   playwright中demo01，其中tests中example.spec.ts为测试代码

......

## 相关node学习文档

<!-- add docs here for user -->
playwright官网：[playwright官网](https://playwright.dev/docs/intro) 

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
$ npm install playwright

# 录制屏幕自动生成代码
$ npx playwright codegen xxx
（xxx表示要跳转的URL网址）

# 运行
# 1、UI模式下运行
$ npx playwright test --ui
# 2、测试单个文件
$ npx playwright test examples.spec.ts
# 3、测试所有文件
$ npx playwright test
# 4、测试特定项目上运行
$ npx playwright test examples.spec.ts --project=chromium
```
