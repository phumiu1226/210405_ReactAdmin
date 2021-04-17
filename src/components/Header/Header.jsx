import React, { Component } from 'react'
import { dateFormatter } from '../../utils/dateUtils';
// import { reqWeather } from '../../api';
import { reqWeather_offline } from '../../api';
import './Header.less';
import { withRouter } from 'react-router-dom';
import menuList from '../../config/menuConfig';
import PubSub from 'pubsub-js'
import { Button, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils'

const { confirm } = Modal;

class Header extends Component {

    state = {
        currentTime: dateFormatter(Date.now()),
        temp: 0,
        icon: '',
        title: '',
    }

    //获取title
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

        //第一次render时候找到header title
        this.setState({ title: this.getTitle() });
        //每点击leftnav从LeftNav里 获取Header Title (PubSub)
        this.token = PubSub.subscribe('menuTitle', (msg, title) => {
            this.setState({ title });
        })
    }

    componentWillUnmount() {
        clearInterval(this.timeInterval);
        PubSub.unsubscribe(this.token);
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
                memoryUtils.user = {};
                storageUtils.removeUser();
                //跳转到login页
                this.props.history.replace('/login');
            },
            onCancel: () => {

            },
        });
    }

    render() {
        const { currentTime } = this.state; //这个要分出来 ， 要不然其他的都要re-render
        const { temp, icon, title } = this.state;

        //第一次render
        if (title === '') return (<span>Loading...</span>);
        else
            return (
                <div className='header'>
                    <div className='header-top'>
                        <span>欢迎，{memoryUtils.user.username}</span>
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


export default withRouter(Header);