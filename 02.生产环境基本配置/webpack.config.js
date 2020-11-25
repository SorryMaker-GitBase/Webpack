/*
    生产环境需要做的工作
    1.css文件的单独打包
    2.代码的压缩
    3.css兼容性的处理
    4.js语法检查
    5.js兼容性处理
    ...
*/
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin =require('optimize-css-assets-webpack-plugin')
//设置node.js运行时的环境变量，默认为生产环境，手动更改为开发环境
//process.env.NODE_ENV = 'development'

module.exports = {
    //入口文件
    entry:'./src/js/index.js',
    //输出文件
    output:{
        filename:'js/built.js',
        path:resolve(__dirname,'build')
    },
    //详细的loader配置
    module:{
        rules:[
            //语法检查 eslint eslint-loader
            //注意：只检查自己写的源代码
            //在package.json中eslintConfig设置检查规则airbnb
            //airbnb 依赖 eslint eslint-config-aribnb-base eslint-plugin-import (下载)
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'eslint-loader',
                options:{
                    //检查到错误后自动修复
                    fix:true
                }
            },
            //js基本兼容性处理 babel babel-loader @babel/core @babel/preset-env @babel/polyfill (下载)           
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:'babel-loader',
                options:{
                    //预设babel-loader进行怎样的兼容性处理
                    //1.'@babel/preset-env'只转换箭头函数等语法,不能转换Promise等
                    //presets:['@babel/preset-env']
                    //2.全部兼容性处理，需要在原代码index.js中引用@babel/polyfill
                    //缺点：js体积太大
                    //3.按需加载。core-js(下载)
                    presets:[
                        [
                            '@babel/preset-env',
                            {
                                //按需加载
                                useBuiltIns:'usage',
                                //指定corejs版本
                                corejs:{
                                    version:3
                                },
                                //指定兼容性做到哪个浏览器版本
                                targets:{
                                    chrome:'60',
                                    firefox:'60',
                                    ie:'9',
                                    safari:'10',
                                    edge:'17'
                                }
                            }
                        ]
                    ]
                }
            },
            //样式资源
            {
                test:/\.css$/,
                //css文件不再使用style-loader,而使用mini-css-extract-plugin插件独立打包为新的css文件
                //css兼容性处理，需要用到postcss -->使用postcss-loader postcss-preset-env进行配置，还需要下载
                //还需要在package.json中配置broserslist详细参数，兼容到各种浏览器的版本信息
                use:[
                    MiniCssExtractPlugin.loader,'css-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            ident:'postcss',
                            plugins:()=>[
                                require('postcss-preset-env')()
                            ]
                        }
                    }
                ]
            },
            {
                test:/\.less$/,
                use:[
                    MiniCssExtractPlugin.loader,'css-loader','less-loader',
                    {
                        loader:'postcss-loader',
                        options:{
                            ident:'postcss',
                            plugins:()=>[
                                require('postcss-preset-env')()
                            ]
                        }
                    }
                ]
            },
            //图片资源
            //打包了css中的背景图片资源
            {
                test:/\.(jpg|png|gif)$/,
                loader:'url-loader',
                options:{
                    limit:8*1024,
                    name:'[hash:10].[ext]',
                    // esModule:false
                    outputPath:'images'
                }
            },
            //html中的img资源
            {
                test:/\.html$/,
                loader:'html-loader'
            },
            //其他资源处理
            {
                exclude:/\.(html|js|css|less|png|jpg|gif)/,
                loader:'file-loader',
                options:{
                    name:'[hash:10].[ext]',
                    outputPath:'media'
                }
            }
        ]
    },
    //插件配置
    plugins:[
        //html资源需要使用插件html-webpack-plugin
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            //额外参数压缩html
            minify:{
                //移除空格
                collapseWhitespace:true,
                //移除注释
                removeComments:true
            }
        }),
        //使用mini-css-extract-plugin插件独立打包为新的css文件,main.css
        new MiniCssExtractPlugin({
            //输出css文件路径,额外添加路劲，会使得css文件中的背景图片路劲出现问题
            //filename:'css/built.css'
            filename:'built.css'
        }),
        //压缩css optimize-css-assets-webpack-plugin
        new OptimizeCssAssetsWebpackPlugin()
    ],
    devServer:{
        //运行命令行：npx webpack-dev-server
        contentBase:resolve(__dirname,'build'),
        compress:true,
        port:3000,
        open:true
    },
    //生产环境会自动压缩js
    // mode:'production',
    mode:'development'

}