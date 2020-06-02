# 标准页面
本项目是一个脚手架，用来方便制作单页页面。适用于小项目。

# 安装
1. 这个项目是github 模板项目，可以直接使用模板功能
2. 使用脚本下载安装使用, 支持Linux和Mac

`
curl -s https://nasetech.github.io/standard-setup/install.sh | bash
`
3. Windows可以下载解压

# 运行开发模式
npm run start-remote 启动webpack dev server ，可以通过http://localhost:8080 访问， 也可以通过手机远程访问ip, 远程访问前需要修改apo.config.js 中的API_URL

# 打包
通过 npm run dist 打包，所有的相关的文件都会被打包到 dist 文件夹。

#部署
使用./deploy.sh进行部署，或者拷贝dist 进行部署。

#其他
1. 开发模式下，所有src的文件改动都会自动起作用，其他可能需要手动刷新页面，或者可能需要重新开发webpack server: npm run start-remote
2. src 中一级文件夹的名称就是打包后html的路由，比如src->test 文件夹的代码会最终生成 http://localhost:8080/test.html
3. src 中一级文件夹必须包含index.html, main.js, css/, image/
4. 注意main.js是一个入口文件， 用来import所有需要的依赖,可以import css和其他资源。
5. 代理访问线上服务需要启动node的代理 node proxy.js
6. 支持多个文件夹，生成多个和文件夹同名的html