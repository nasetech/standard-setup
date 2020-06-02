const webpack = require('webpack');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAutoInject = require('webpack-auto-inject-version');
const TerserPlugin = require('terser-webpack-plugin');

const appConfig = require('./app.config');

const prodMode = process.env.NODE_ENV == 'production';
const publicPath = `${appConfig.publicPath}${appConfig.prodPrefix}`;
//不要使用source-map，而是使用eval，因为sourcemap发现source 并没有更新，在调试的时候出现行数对不上的情况console.log打印出来的显示是49行，但是断电其实是在其他行
// source-map的例子https://github.com/webpack/webpack/tree/master/examples/source-map
//讨论 https://github.com/facebook/create-react-app/issues/2407
const sourceMap = prodMode ? false : 'eval';

const SRC_DIR = 'src/';
const API_URL = appConfig.API_URL;

let files = fs.readdirSync(SRC_DIR);
let entries = {};
files.forEach(function(folder) {
  let path = `${__dirname}/${SRC_DIR}/${folder}`;

  if (fs.statSync(path).isDirectory()) {
    if(fs.existsSync(`${path}/main.js` )){
      entries[folder] = `./${SRC_DIR}/${folder}/main.js`;
    }
  }
});

let entryKeys = Object.keys(entries);
let htmlPlugins = entryKeys.map(entry=>{
  let opt = {
    filename : `${entry}.html`,
    template: `${SRC_DIR}${entry}/index.html`,
    apiUrl : `${API_URL}`,
    inject: 'body',
    prefix : `${publicPath}`,
    entryPath: prodMode ? `${publicPath}${entry}` : '',
    entryName : entry, // this define the entryName base on the container folder
    imagePrefix : `${publicPath}/image/${entry}/image/`,// this define the entryName base on the container folder
    chunks: [entry]
  };
  console.log(opt);
  return new HtmlWebpackPlugin(opt)
})

/**
 * Here we copy all images in page folder to image folder
 */
let images = entryKeys.filter(entry=>{
  let from = `${SRC_DIR}/${entry}/image/`;
  if(fs.existsSync(from)){
    return true;
  }
})
.map(entry=>{
  let from = `${SRC_DIR}/${entry}/image/`;
  return {from : from, to: `image/${entry}/image/`}
})

// console.log(images);

module.exports = {
  entry: entries,
  module: {
    rules: [
      {test: /\.(eot|ttf|svg)$/,loader: 'url-loader?limit=100000'},
      {
        test: /\.less$/,
        loader: 'less-loader', // compiles Less to CSS
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules\/(?!(swiper)\/).*/,
        // exclude: /node_modules\/(?!(MY-MODULE|ANOTHER-ONE)\/).*/,
        use: {
          loader: 'babel-loader',
          /**
           * 以下设置是支持IE旧版的设置， 需要IE支持则打开
           */
          // options: {
            // "plugins": ["@babel/plugin-transform-property-mutators"],
            // "presets": [
            //   [
            //     "@babel/preset-env",
            //     {
            //       "targets": {
            //         // "node": "5",
            //         // "esmodules": true,
            //         // browsers: [
            //           // 'ie 8-10'
            //           // 'defaults',
            //           // 'not ie <= 8'
            //           // "> 50%",
            //         // ]
            //       }
            //     }
            //   ]
            // ]
          // }
        }
      },
      {
        test: /\.css$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, 
        loader: "file-loader" 
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: publicPath+'/',
    /**  保持原来名字 ，用于给他人集成时使用*/
    filename: '[name].js',
    chunkFilename: '[name].js',

    /**  开发状态：保持原来名字 。 生产状态： 使用hash*/
    // filename: !prodMode ? '[name].js': '[hash].js',
    // chunkFilename: !prodMode ? '[name].js': '[chunkhash].js'

    /**  全部使用hash*/
    // filename:  '[id].[hash].js',
    // chunkFilename: '[id].[chunkhash].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     output: {
      //       // prevent version info to be removed from bundle.js
      //       comments: /\[AIV\]/,
      //       // comments: false,
      //     },
      //   },
      // }),
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          output: {
            comments:  /\[AIV\]/,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    /** 
     * 注入注释
    */
    new WebpackAutoInject({
      SHORT: 'NASETECH.COM',
      SILENT: false,
      PACKAGE_JSON_PATH: './package.json',
      PACKAGE_JSON_INDENT: 4,
      components: {
        AutoIncreaseVersion: true,
        InjectAsComment: true,
        InjectByTag: true
      },
      componentsOptions: {
        AutoIncreaseVersion: {
          runInWatchMode: true // it will increase version with every single build!
        },
        InjectAsComment: {
          tag: 'Version: {version} - {date}',
          dateFormat: 'h:MM:ss TT', // change timezone: `UTC:h:MM:ss` or `GMT:h:MM:ss`
          multiLineCommentType: false, // use `/** */` instead of `//` as comment block
        },
        InjectByTag: {
          fileRegex: /\.+/,
          // regexp to find [AIV] tag inside html, if you tag contains unallowed characters you can adjust the regex
          // but also you can change [AIV] tag to anything you want
          AIVTagRegexp: /(\[AIV])(([a-zA-Z{} ,:;!()_@\-"'\\\/])+)(\[\/AIV])/g,
          dateFormat: 'h:MM:ss TT'
        }
      }
    }),// auto inject version
    new CopyWebpackPlugin(images.concat({from : `${SRC_DIR}/common/image`, to: 'image'})),
    // new PurifyCSSPlugin({
    //   // Give paths to parse for rules. These should be absolute!
    //   paths: glob.sync(path.join(__dirname, 'src/*.css')),
    // })
    new MiniCssExtractPlugin({
      /**  保持原来名字，用于给他人集成时使用 */
      // filename: '[name].css' ,
      // chunkFilename: '[id].css'

      /**  开发状态：保持原来名字 。 生产状态： 使用hash*/
      filename: !prodMode ? '[name].css' : '[hash].css',
      chunkFilename: !prodMode ? '[id].css' : '[hash].css'

      /**  全部使用hash*/
      // filename: '[id].[hash].css',
      // chunkFilename: '[id].[hash].css'
    })
  ].concat(htmlPlugins),
  devServer: {
    contentBase: './src',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      https: true
    }
  },
  devtool: sourceMap
};