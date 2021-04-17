import React, { Component } from 'react'
import './LeftNav.less'
import logo from '../../assets/images/logo.png'
import { Link, withRouter } from 'react-router-dom'
//menu style from antd
import { Menu } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
//menuList
import menuList from '../../config/menuConfig';
//pubsub-js send data
import PubSub from 'pubsub-js'

const { SubMenu } = Menu;

// 左侧导航组件

class LeftNav extends Component {

    //constructor
    state = {
        menuNodes: '',
    }

    // 根据menu的数据数组 生成对象的标签数组

    //使用map来获取nodes
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            /*
                {
                    title : '首页',
                    key : '/home',
                    icon : 'home',
                    children : [],  //可能有,也有可能没有
                }
            */

            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {/* 使用递归调用 */}
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

        })
    }

    //判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const { key, isPublic } = item;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        //1.如果当前用户是admin
        //2.如果当前item是公开的
        //3.当前用户有此item的权限 ： key有没有menus中
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { //4.如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false;
    }

    //使用reduce生成nodes
    getMenuNodes_reduce = (menuList) => {
        //辅助获取path 来设置defaultOpenKeys , 刷新页面时运行一次
        let path = this.props.location.pathname;
        //情况 ： 看productDetai时 url会变成/product/detail , 这时的navLeft 不会选中 nav 来添加active
        if (path.indexOf('/product') === 0) { //当前请求时product会 product的子路由界面
            path = '/product';
        }
        return menuList.reduce((pre, item) => {
            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                //向pre添加 <Menu.Item>
                if (!item.children) {
                    pre.push((
                        // handleClick 每次点击传递title给header
                        <Menu.Item key={item.key} icon={item.icon} onClick={(e) => {
                            e.domEvent.stopPropagation(); //这里的stopPropagation 是antd的所以要交使用domEvent
                            this.onHandleClick(item.title);
                        }}>
                            <Link to={item.key}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    ))
                }
                //向pre添加 <Submenu>
                else {
                    //获取defaultOpenKeys , 在children里查找谁的key符合，那么那个Item(children的父)就是defaultOpenKeys的值
                    const cItem = item.children.find(cItem => cItem.key === path);
                    if (cItem) this.openKeys = item.key;

                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {/* 使用递归调用 */}
                            {this.getMenuNodes_reduce(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre;
        }, []);
    }

    onHandleClick = (title) => {
        //send title to Header (Header need item title to show)
        //使用订阅来send
        PubSub.publish('menuTitle', title);
    }

    UNSAFE_componentWillMount() {
        const menuNodes = this.getMenuNodes_reduce(menuList);
        this.setState({
            menuNodes
        });
    }


    render() {
        //得到当前请求的router路径
        //location是router的属性，下面的withRouter已经传给这个组件3个router属性 , 把path交给Menu的defaultSelectedKeys
        let path = this.props.location.pathname;
        //情况 ： 看productDetai时 url会变成/product/detail , 这时的navLeft 不会选中 nav 来添加active
        if (path.indexOf('/product') === 0) { //当前请求时product会 product的子路由界面
            path = '/product';
        }

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo" />
                    <h1>谷粒后台</h1>
                </Link>

                <Menu
                    //defaultSelectedKeys={[path]} //这个只执行一次 ，如果我们在浏览器直接输入localhost:3000，它不会自动选择/home  ， 不会动态的跟着我们
                    selectedKeys={[path]} //这个会执行多次 ， 会动态的跟着我们
                    //由于componentDidMount是render完才运行，所以第一次render没能获得menuNodes数据 => getMenuNodes没运行 => this.openKey=undefine
                    //而defaultOpenKeys只在第一次render运行 所以不能使用 componentDidMount
                    defaultOpenKeys={[this.openKeys]}
                    mode="inline"
                    theme="dark"
                >
                    {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                        <Link to='/home'>
                            首页
                        </Link>
                    </Menu.Item>

                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                        <Menu.Item key="/category" icon={<ContainerOutlined />}>
                            <Link to='/category'>
                                品类管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product" icon={<ContainerOutlined />}>
                            <Link to='/product'>
                                商品管理
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user" icon={<DesktopOutlined />}>
                        <Link to='/user'>
                            用户管理
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/role" icon={<ContainerOutlined />}>
                        <Link to='/role'>
                            角色管理
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
                        <Menu.Item key="/bar" icon={<ContainerOutlined />}>
                            <Link to='/bar'>
                                柱形图
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/line" icon={<ContainerOutlined />}>
                            <Link to='/line'>
                                折线图
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/pie" icon={<ContainerOutlined />}>
                            <Link to='/pie'>
                                饼图
                            </Link>
                        </Menu.Item>
                    </SubMenu> */}
                    {
                        this.state.menuNodes
                    }

                </Menu>

            </div>
        )
    }
}


/*
    widthRouter 组件：
    包装非路由组件，返回一个新的组件
    新的组件 向 非路由组件传递 3个属性 ： history / location / match
*/

export default withRouter(LeftNav);