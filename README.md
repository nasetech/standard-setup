# 标准页面
本项目是一个脚手架，用来方便制作单页页面。适用于小项目。

# 安装


1. 通过 npm run start-remote 启动webpack dev server ，可以通过http://localhost:8080 访问， 也可以通过手机远程访问ip
2. 通过 npm run dist 打包，所有的相关的文件都会被打包到 dist 文件夹。
3. 使用./deploy.sh进行部署，或者拷贝dist 进行部署。
4. src 中一级文件夹的名称就是打包后html的路由，比如src->didi 文件夹的代码会最终生成 http://localhost:8080/didi.html
5. src 中一级文件夹必须包含index.html, main.js, css/, image/
6. 注意main.js是一个入口文件， 用来import所有需要的依赖。
7. 代理访问线上服务需要启动node的代理 node proxy.js