import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types';

const Item = Form.Item;

//添加/修改user form


const UserForm = (props) => {
    const [form] = Form.useForm();

    const style = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    }

    const user = props.user || {}


    // lifecycle
    useEffect(() => {
        //把form传给User 来获取数据
        props.setForm(form);
    }, [form, props]);

    return (
        <Form form={form}
            {...style}
            initialValues={{
                role_id: user._id ? user.role_id : null,
                username: user.username,
                password: user.password,
                phone: user.phone,
                email: user.email,

            }}
        >
            <Item
                label='用户名 : '
                name='username'
                rules={[
                    { required: true, whitespace: true, message: '用户名不能为空' },
                    { min: 6, message: '用户名不能少于6位 ' }
                ]}
            >
                <Input placeholder='请输入密码' />
            </Item>
            {
                user._id ? null : (<Item
                    label='密码 : '
                    name='password'
                    rules={[
                        { required: true, whitespace: true, message: '密码不能为空 !' },
                        { min: 6, message: '用户名不能少于6位 ' }
                    ]}
                >
                    <Input.Password placeholder='请输入手机号' />
                </Item>)
            }

            <Item
                label='手机号 : '
                name='phone'
                rules={[
                    { required: true, whitespace: true, message: '手机号不能为空 !' },
                    { pattern: /^[0-9.-]{9,12}$/, message: '手机号码只包含（数字 - .），位数为9到12' }
                ]}
            >
                <Input placeholder='请输入邮箱' />
            </Item>
            <Item
                label='邮箱 : '
                name='email'
                rules={[
                    { required: true, whitespace: true, message: '邮箱不能为空 !' },
                    { type: 'email', message: '邮箱不正确 !' },
                ]}
            >
                <Input placeholder='请输入邮箱' />
            </Item>
            <Item
                label='角色 : '
                name='role_id'
                rules={[{ required: true, message: '请选择角色!' }]}
            >
                {/* 这里的placeholder， 上面initialValues 要为null才显示 */}
                <Select placeholder="请选择角色">
                    {
                        props.roles.map((role) => {
                            return (
                                <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                            )
                        })
                    }

                </Select>
            </Item>

        </Form>
    )
}

UserForm.propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object,
}


export default UserForm;