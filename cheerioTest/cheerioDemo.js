const cheerio = require('cheerio')
const axios = require('axios')
const url = require('url')
const fs = require('fs')

const request = axios.create({
  baseURL: 'https://cnodejs.org/' // 基础路径
})

const getLastPage = async () => {
  const { data } = await request({
    method: 'GET',
    url: '/',
    params: { // tab=all&page=1
      tab: 'all',
      page: 1
    }
  })

  const $ = cheerio.load(data)

  const paginations = $('.pagination a')

  const lastPageHref = paginations.eq(paginations.length - 1).attr('href')

  const { query } = url.parse(lastPageHref, true)

  return query.page
}

// 需求：获取 cnodejs.org 网站所有的文章列表（文章标题、发布时间、文章内容）
//      并且将该数据存储到数据库中

// 获取所有文章列表
const getArticles = async () => {
  const lastPage = await getLastPage()
  const links = []
  for (let page = 1; page <= lastPage; page++) {
    const { data } = await request({
      method: 'GET',
      url: '/',
      params: { // tab=all&page=1
        tab: 'all',
        page
      }
    })
    const $ = cheerio.load(data)
    $('.topic_title').each((index, element) => {
      const item = $(element) // 转换为 $ 元素
      links.push(item.attr('href'))
    })
    // 每次抓取完一页的数据就等待一段时间，太快容易被发现
    await new Promise(resolve => {
      setTimeout(resolve, 500)
    })
    console.log(links.length)
  }
  return links
}

// 获取文章内容
const getArticleContent = async (url) => {
  const { data } = await request({
    method: 'GET',
    url
  })
  const $ = cheerio.load(data)
  const title = $('.topic_full_title').text().trim()
  const changes = $('.changes span')
  const date = changes.eq(0).text().trim()
  const author = changes.eq(1).find('a').text().trim()
  const content = $('.markdown-text').html()
  return {
    title,
    author,
    date,
    content
  }
}

const main = async () => {
  // 1. 获取所有文章列表链接
  const articles = await getArticles()
  // 2. 遍历文章列表
  for (let i = 0; i < articles.length; i++) {
    const link = articles[i]
    const article = await getArticleContent(link)
    fs.appendFileSync('./db.txt', `
标题：${article.title}
作者：${article.author}
发布日期：${article.date}
文章内容：${article.content}
\r\n\r\n\r\n\r\n
`)
    console.log(`${link} 抓取完成`)
    await wait(500)
  }
}

main()

function wait (time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}