var express = require('express');
var proxy = require('http-proxy-middleware');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.static('static'));

/**
 * 例子：本地的以/app开头的请求会代理发到网上服务
 */
app.use('/app', proxy({
  target: 'https://dev.nase.tech/',
  changeOrigin: true
}));

app.listen(3444, (e) => {
  console.log(`本地静态服务: http://localhost:3444`);
});