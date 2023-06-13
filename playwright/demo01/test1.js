import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E5%B7%A5%E4%BD%9C%E6%98%93&fenlei=256&rsv_pq=0x8e5a17e000016f41&rsv_t=4354XH7Wk24Z8bec94Eq5WV1xemu1e5j%2F7W%2BNEbxerJxZI6mduWtGgnroyvV&rqlang=en&rsv_enter=1&rsv_dl=tb&rsv_sug3=12&rsv_sug1=10&rsv_sug7=100&rsv_sug2=0&rsv_btype=i&prefixsug=%25E5%25B7%25A5%25E4%25BD%259C%25E6%2598%2593&rsp=5&inputT=7635&rsv_sug4=8708');
  await page1.goto('https://www.easypie.com/');
  await page1.getByText('自动查询异常件').click();
  await page1.getByText('3分钟打造智能助手，开启高效办公模式 抓取股票行情信息 打开同花顺行情中心，抓取所有股票指定页数的数据，并存入Excel表格中 抓取商品信息_1688 根据用户').click({
    button: 'right'
  });
  await page1.getByText('自动查询异常件').click({
    button: 'right'
  });
  await page.locator('#content_left').click({
    button: 'right'
  });
  await page.getByRole('link', { name: '就业招聘-就业网-人才就业-招聘找工作-上51Job!' }).click({
    button: 'right'
  });
  await page.getByRole('link', { name: '就业招聘-就业网-人才就业-招聘找工作-上51Job!' }).click({
    button: 'right'
  });
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '就业招聘-就业网-人才就业-招聘找工作-上51Job!' }).click();
  const page2 = await page2Promise;
});