import React, { Component } from 'react'
import { dateFormatter } from '../../utils/dateUtils';
// import { reqWeather } from '../../api';
import { reqWeather_offline } from '../../api';
import './Header.less';
import { withRouter } from 'react-router-dom';
import menuList from '../../config/menuConfig';
// import PubSub from 'pubsub-js'
import { Button, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import memoryUtils from '../../utils/memoryUtils';
// import storageUtils from '../../utils/storageUtils'

import { connect } from 'react-redux' //这个是react-redux容器
import { setHeadTitle } from '../../redux/actions'
import { logout } from '../../redux/actions'

const { confirm } = Modal;

class Header extends Component {

    state = {
        currentTime: dateFormatter(Date.now()),
        temp: 0,
        icon: '',
        // title: '',  //使用redux代替 state里面不用存在title
    }

    //#region   获取title
    getTitle = () => {
        let title;
        const path = this.props.location.pathname;
        // localhost:3000的时候 没能获取pathname , 因为header组件是跟着admin渲染的，所以第一次渲染时pathname肯定时‘/’ => 没能获取‘/home’
        if (path === '/') return "首页";
        menuList.every((item) => {
            if (item.key === path) {
                title = item.title;
                return false;
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path);
                if (cItem) {
                    title = cItem.title;
                    return false;
                }
            }
            return true;
        });
        return title;
    }
    //#endregion

    SetDateTimeInterval = () => {
        this.timeInterval = setInterval(() => {
            const currentTime = dateFormatter(Date.now());
            this.setState({ currentTime });
        }, 1000);
    }

    getWeather = async () => {
        //在线获取
        // const rs = await reqWeather('saigon');
        //模拟获取
        const rs = await reqWeather_offline();
        const { temp, icon } = rs;
        //更新状态
        this.setState({ temp, icon });
    }

    componentDidMount() {
        //获取当前时间日期
        this.SetDateTimeInterval();
        //获取当前日期
        this.getWeather();

        //第一次render时候找到header title ----- 不用了 现在用redux来代替
        // this.setState({ title: this.getTitle() });
        //每点击leftnav从LeftNav里 获取Header Title (PubSub) ----- 不用了 现在用redux来代替
        // this.token = PubSub.subscribe('menuTitle', (msg, title) => {
        //     this.setState({ title });
        // })
    }

    componentWillUnmount() {
        clearInterval(this.timeInterval);
        // PubSub.unsubscribe(this.token);  //----- 不用了 现在用redux来代替
    }

    // 确认退出
    onLogout = () => {
        confirm({
            title: '温馨提示',
            icon: <ExclamationCircleOutlined />,
            content: '您确定要退出吗？',
            //这里要改成箭头函数
            onOk: () => {
                //把保存的用户名都删了
                // memoryUtils.user = {}; //----- 不用了 现在用redux来代替
                // storageUtils.removeUser();//----- 不用了 现在用redux来代替
                //跳转到login页
                // this.props.history.replace('/login'); --不用了 现在用redux来代替 redux会自动查找哪个组件 使用store的属性 就会自动re-render
                this.props.logout();
                this.props.setHeadTitle('首页');

            },
            onCancel: () => {

            },
        });
    }

    render() {
        const { currentTime } = this.state; //这个要分出来 ， 要不然其他的都要re-render
        const { temp, icon } = this.state;
        //const {title} = this.state; //----- 不用了 现在用redux来代替
        const title = this.props.headTitle;

        //第一次render
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{this.props.user.username}</span>
                    <Button type="link" onClick={this.onLogout}>退出</Button>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={icon} alt='weatherIcon' />
                        <span>{temp} °C</span>
                    </div>
                </div>
            </div>
        )
    }
}


//把容器链接组件 然后从store获取数据
export default connect(
    state => ({ headTitle: state.headTitle, user: state.user }),
    { setHeadTitle, logout }
)(withRouter(Header));