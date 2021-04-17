/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块 （封装来减少前台请求是要传递的参数
每个函数的返回值都是promise
*/

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd';
import offlineWeather from '../utils/offlineWeather';
import { getRandomNumber } from '../utils/random';
//登录
// export function reqLogin(username, password) {
//     return ajax('/login', { username, password }, 'POST');
// }

const base = '/apiPort5000';


//-----------------------登录-----------------------

export const reqLogin = (username, password) => ajax(base + '/login', { username, password }, 'POST');

//-----------------------用户-----------------------

//获取用户表
export const reqUsers = () => ajax(base + '/manage/user/list');

//添加用户 + 修改用户
export const reqAddOrUpdateUser = (user) => ajax(base + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST');


//删除用户
export const reqDeleteUser = (userId) => ajax(base + '/manage/user/delete', { userId }, 'POST');




//-----------------------category - 分类列表-----------------------
//获取category
export const reqCategorys = (parentId = 0) => ajax(base + '/manage/category/list', { parentId }, 'GET');
//获取category by id 
export const reqCategory = (categoryId) => ajax(base + '/manage/category/info', { categoryId }, 'GET');
//添加category
export const reqAddCategory = (parentId, categoryName) => ajax(base + '/manage/category/add', { parentId, categoryName }, 'POST');

//修改category // 这里参数为{parentId, categoryName} 意思时 参数时一个obj ， obj里有parentId, categoryName => 2个参数时 取obj里面出来的
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(base + '/manage/category/update', { categoryId, categoryName }, 'POST');

//-----------------------product-----------------------
//获取category
export const reqProducts = (pageNum, pageSize) => ajax(base + '/manage/product/list', { pageNum, pageSize });
//搜索
//searchType : 搜索类型 ： productName/productDesc
export const reqSearchProducts = (pageNum, pageSize, searchText, searchType) => ajax(base + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchText,
});

//添加 + 修改商品 : _id有值就是修改 ， 没值就时添加
export const reqAddOrUpdateProduct = (product) => ajax(base + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST');
//修改商品
// export const reqUpdateProduct = (product) => ajax(base + '/manage/product/update', product, 'POST');

//更新商品的状态 status （上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(base + '/manage/product/updateStatus', { productId, status }, 'POST');
//删除图片
export const reqDeleteImg = (name) => ajax(base + '/manage/img/delete', { name }, 'POST');


//-----------------------role 角色-----------------------

//获取角色列表
export const reqRoles = () => ajax(base + '/manage/role/list');
//添加
export const reqAddRole = (roleName) => ajax(base + '/manage/role/add', { roleName }, 'POST');
//修改 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax(base + '/manage/role/update', role, 'POST');

//-----------------------预报天气-----------------------
// jsonp 请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        //tphcm
        // const city = 'Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh';
        // https://home.openweathermap.org/api_keys
        const apiKey = '743a5c4f5fe18db9855cb2ee94f003c6';
        //do C
        const units = 'metric'
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
        jsonp(url, {}, (err, data) => {
            //请求成功
            if (data.cod === 200) {
                //获取温度
                const { temp } = data.main;
                //获取详情
                const { main: tempDescription, icon: iconCode } = data.weather[0];
                const icon = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
                //返回数据
                const rs = { temp, tempDescription, icon };
                resolve(rs);
            }//请求失败
            else {
                message.error('获取天气预报信息失败');
            }
        });
    });
}

//模拟预报天气返回结果
export const reqWeather_offline = () => {
    return new Promise((resolve, reject) => {
        const randomNumber = getRandomNumber(0, 4);
        const { temp } = offlineWeather[randomNumber].main;
        const { main: tempDescription, icon: iconCode } = offlineWeather[randomNumber].weather[0];
        const icon = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const rs = { temp, tempDescription, icon };
        resolve(rs);
    });
}


/*


有2种暴露方法 ：

1/统一暴露
export default {
    xxx(){

    }
    yyy(){

    }
}

2/分别暴露
export function(){

}

export function(){

}

*/


