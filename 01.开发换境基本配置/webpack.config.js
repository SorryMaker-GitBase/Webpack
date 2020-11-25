const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
            //样式资源
            {
                test:/\.css$/,
                //style-loader将css资源以<style>标签的形式挂载到html上，不会单独打包成新的文件
                use:['style-loader','css-loader']
            },
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
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
            template:'./src/index.html'
        })
    ],
    devServer:{
        //运行命令行：npx webpack-dev-server
        contentBase:resolve(__dirname,'build'),
        compress:true,
        port:3000,
        open:true
    },
    mode:'development'
}