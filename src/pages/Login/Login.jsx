import React, { Component } from 'react'
import './Login.less'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'
import Loading from '../../components/Loading/Loading'
/*
1.前台表单验证
    用户名/密码的合法性要求
        - 必须输入
        - 必须大于4位
        - 必须小于12位
        - 必须是英文、数字或下滑线组成
2.收集表单数据
*/


export default class Login extends Component {

    state = {
        loading :false
    }

    //form校验成功后执行
    onFinish = async (values) => {
        //提交ajax请求  请求登录
        this.setState({loading:true})
        // console.log('Success:', values);
        const { username, password } = values;
        const rs = await reqLogin(username, password);
        this.setState({loading:false})
        if (rs.status === 0) {
            message.success('登录成功！');
            //保存user
            const user = rs.data;
            memoryUtils.user = user; //保存在内存中
            storageUtils.saveUser(user);//保存到local里
            //跳转回admin网页
            this.props.history.replace('/');
        } else {
            message.error(rs.msg);
        }

    }
    //form校验失败后执行
    onFinishFailed = (error) => console.error('校验失败 ！！', error);


    // 密码自定义验证
    validatePwd = (rule, value) => {
        if (!value)
            return Promise.reject('请输入密码 ！');
        else if (value.length < 4)
            return Promise.reject('密码不能少于4位！');
        else if (value.length > 12)
            return Promise.reject('密码不能多于12位！');
        else if (!/^[a-zA-Z0-9_]+$/.test(value))
            return Promise.reject('密码必须是英文、数字或下滑线组成！');
        else
            return Promise.resolve();
    }

    render() {

        if(this.state.loading===true) return <Loading />

        //如果用户已经登录，自动跳转到管理页面去
        const user = memoryUtils.user;
        if (user._id) {
            return <Redirect to='/' />
        }

        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt='logo' />
                    <h1>React项目：后台管理系统</h1>
                </header>

                <section className='login-content'>
                    <h2>用户登录</h2>
                    <div>
                        <Form
                            onFinish={this.onFinish} //校验成功后执行
                            onFinishFailed={this.onFinishFailed} //校验失败后执行
                            name="normal_login" className="login-form"
                            initialValues={{ username: 'admin' }} //默认值 随着 Form.Item 里的 name
                        >

                            <Form.Item
                                // label="username"
                                name="username"
                                // 声明式验证 ： 直接使用别人定义好的验证规则进行验证
                                rules={[
                                    { required: true, whitespace: true, message: '请输入用户名！' },
                                    { min: 4, message: '用户名不能少于4位！' },
                                    { max: 12, message: '用户名不能多于12位！' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下滑线组成！' },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" style={{ color: '#ccc' }} />} placeholder="请输入用户名" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                //自定义验证
                                rules={[
                                    { validator: this.validatePwd },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" style={{ color: '#ccc' }} />}
                                    type="password"
                                    placeholder="请输入密码"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}



