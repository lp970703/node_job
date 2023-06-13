import { test, expect } from '@playwright/test';


test('has title', async ({page}) => {
  // const browser = await chromium.launch({ headless: false, slowMo: 50 });//模拟打开浏览器,设置有头模式，并通过slowMo属性减慢浏览器的每一步操作
  // const context = await browser.newContext();//建立context
  // const page = await context.newPage();//模拟打开一个浏览器的标签页
  await page.goto('https://www.baidu.com/');
  await page.locator('#kw').click();
  await page.locator('#kw').fill('工作易');
  await page.getByRole('button', { name: '百度一下' }).click();
  await page.getByRole('button', { name: '百度一下' }).click();
  // const page1Promise = page.waitForEvent('popup');
  // await page.getByRole('link', { name: '工作易EasyPie-让你工作更容易的流程自动化智能助手' }).click();
  // const page1 = await page1Promise;
  //*[@id="2"]/div/div/h3/a
  //*[@id="content_left"]/div[3]/div/div/div/div/div[1]/div/div/h3/div/a
  // #content_left > div:nth-child(3) > div > div > div > div > div:nth-child(1) > div > div > h3 > div > a
  // await page.get
  await page.click("#content_left > div:nth-child(3) > div > div > div > div > div:nth-child(1) > div > div > h3 > div > a")
  await page.waitForTimeout(1000);
  
  // await page1.getByRole('link', { name: '工作易' }).click();
  // await page1.getByRole('link', { name: '首页' }).click();
  // await page1.getByRole('heading', { name: '物流运输' }).click();
  // await page1.getByText('自动查询异常件').click();
  
});
