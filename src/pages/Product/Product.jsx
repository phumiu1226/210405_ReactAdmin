import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';

import ProductAddUpdate from './AddUpdate'
import ProductHome from './Home'
import ProductDetail from './Detail'

import './product.less'

// 商品路由

export default class Product extends Component {
    render() {
        return (
            <Switch>
                {/* 精准匹配 */}
                <Route path='/product' component={ProductHome} exact />
                <Route path='/product/add-update' component={ProductAddUpdate} />
                <Route path='/product/detail' component={ProductDetail} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}
