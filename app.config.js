
const CDN_PATH = '//cdnserver.com';
const publicPath = process.env.NODE_ENV == 'production' ? `${CDN_PATH}/home` : '';
// 在生产上可能有前缀的，比如本地访问可以是http://localhostt:8080/test.html, 在生产环境下可以是http://cdnserver.com/prefix/test.html
const prodPrefix = process.env.NODE_ENV == 'production' ? '/prefix' : ''; 
//可以将localhost改为你自己的IP地址，这样可以通过手机在局域网中访问
const API_URL = process.env.NODE_ENV == 'production' ? '//devserver.com' : '//192.168.1.2:3444' 

module.exports = {
  CDN_PATH : CDN_PATH,
  API_URL: API_URL,
  publicPath : publicPath,
  prodPrefix : prodPrefix
};