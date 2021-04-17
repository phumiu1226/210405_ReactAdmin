import React, { Component } from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from 'react-router-dom' //路由配置
import { Layout } from 'antd';

//layout
import Header from '../../components/Header/Header'
import LeftNav from '../../components/LeftNav/LeftNav'

//路由组件
import Home from '../Home/Home'
import Category from '../Category/Category'
import Product from '../Product/Product'
import Role from '../Role/Role'
import User from '../User/User'
import Bar from '../Charts/Bar'
import Line from '../Charts/Line'
import Pie from '../Charts/Pie'
import Test from '../Test/Test'

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {

        const user = memoryUtils.user;
        //如果内存没有储存user => 当前没有登录
        if (!user._id) {
            //自动跳转到登录页面
            return <Redirect to='/login' />
        }

        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    {/* 配置路由 */}
                    <Content style={{ margin: '20px', backgroundColor: 'white' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/bar' component={Bar} />
                            <Route path='/line' component={Line} />
                            <Route path='/pie' component={Pie} />
                            <Route path='/test' component={Test} />
                            <Redirect to='/home' />
                        </Switch>

                    </Content>

                    <Footer style={{ textAlign: 'center', color: 'rgb(152, 153, 155)' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
