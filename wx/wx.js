// index.js
const express = require('express')
const request = require('request') //用于请求外部API（如https://api.weixin.qq.com/sns/oauth2/）的插件
const app = express()
const port = 3000
var AppID = '微信公众号APPID（测试、正式号都可以）'
var AppSecret = 'ad8b2464d96436e693c6cb1c47243055'
var code = ''
 
app.get('/getCode', (req, res) => {
    var return_uri = 'http://127.0.0.1:3000/getAccessToken'
    var scoped = 'snsapi_userinfo'
    var state = '123'
    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope='+scoped+'&state='+state+'#wechat_redirect')
})
 
app.get('/getAccessToken', function(req, res){
    code = req.query.code
    console.log('得到授权码code：', code);
    request.get(
        {
            url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code'
        }, // 请求获取令牌
        function(error,response,body){
            if(response.statusCode == 200){
                let data = JSON.parse(body)
                let access_token = data.access_token;
                let openid = data.openid;
                request.get(
                    {
                        url:'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
                    }, // 调用获取用户信息的api
                    function(error,response,body){
                        var userinfo = JSON.parse(body);
                        console.log(userinfo)
                        res.send("\
                            <h1>"+userinfo.nickname+" 的个人信息</h1>\
                            <p><img src='"+userinfo.headimgurl+"' /></p>\
                            <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                        ");
                    }
                )
            }
        }
    )
})
 
 
app.listen(port, () => {
    console.log('可以启动啦'+'http://localhost:3000')
})