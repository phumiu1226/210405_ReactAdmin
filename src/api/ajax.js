/*
    使用axios发送异步ajax请求函数
    封装axios库
    函数的返回值是promise对象 (后面可以使用async和await来异步请求)
    优化：
    1/统一处理请求异常
        在外出包一个自己创建的promise对象
        在请求出错时，不reject（error），而是显示出错信息
    2/异步需要的不是response，而是response.data
*/

import axios from 'axios'
import { message } from 'antd'

// data，type 有可能没传 所以要有默认值

export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        let promise;
        //1.执行异步ajax请求
        if (type === 'GET') { //发送get请求
            promise = axios.get(url, { //配置对象
                params: data  //指定请求参数
            }
            );
        }
        else { //发送post请求
            promise = axios.post(url, data);
        }
        //2.如果成功了，调用resolve（value）
        promise.then(response => {
            resolve(response.data);
            //3.如果失败了，不调用reject（error）, 而是提示异常信息
        }).catch(error => {
            message.error('请求出错了 : ' + error.message);
        })


    })


}