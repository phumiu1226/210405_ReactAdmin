/*
包含多个action creator函数模块
同步action: 对象 {type:'xx', data: 数据值}
异步action：函数 dispatch =>{}
*/

import { SET_HEAD_TITLE, RECEIVE_USER, RESET_USER } from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils';
import { message } from 'antd'

//设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({ type: SET_HEAD_TITLE, data: headTitle });


//接受用户的同步action
export const receiveUser = (user) => ({ type: RECEIVE_USER, user });

//退出登录的同步action
export const logout = () => {
    storageUtils.removeUser();
    //删除local中的user
    return { type: RESET_USER }
}

//显示错误信息同步action
// export const showErrorMsg = (errorMsg) => ({ type: SHOW_USER_ERROR_MSG, errorMsg });

/* 
登录的异步action
1.发请求
2.保存到redux
*/


export const login = (username, password) => {
    return async dispatch => {
        //1.执行ajax请求
        const rs = await reqLogin(username, password);  //return {status:0 , data:user} {status:1 , msg:'xx'}
        //2.1 如果成功了，分发成功的同步action
        if (rs.status === 0) {
            const user = rs.data;
            //保存local中
            storageUtils.saveUser(user)
            dispatch(receiveUser(user));
        } else {
            //2.2 如果失败了，分发失败的同步action
            // dispatch(showErrorMsg(rs.msg));
            message.error(rs.msg);
        }

    }
}