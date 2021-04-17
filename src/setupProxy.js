//脚手架在初始化已经下载好了

//这个是由module里 webpack-dev-server 调用 http-proxy-middleware 来配置代理请求的

//使用commonjs 语法 (nodejs)
const proxy = require('http-proxy-middleware');


module.exports = function (app) {
    app.use(
        proxy('/apiPort5000', {
            target: 'http://localhost:5000', //先读取数据的服务器url
            //changeOrigin: false, //控制服务器收到的请求头（request - header）中‘host’字段的值  ------- 在服务器里（node index.js）看结果  没有这行 请求的port会是3000
            pathRewrite: { '^/apiPort5000': '' } //把api1给删了
        })
    )

    app.use(
        proxy('/api2', {
            target: 'http://localhost:8081', //先读取数据的服务器url
            changeOrigin: true, //控制服务器收到的请求头（request - header）中‘host’字段的值  ------- 在服务器里（node index.js）看结果  没有这行 请求的port会是3000
            pathRewrite: { '^/api2': '' } //把api2给删了
        })
    )
}