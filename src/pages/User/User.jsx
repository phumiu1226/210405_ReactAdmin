import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { dateFormatter } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import Loading from '../../components/Loading/Loading'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from './UserForm'
// 用户路由



export default class User extends Component {

    //-----------------------init-----------------------
    state = {
        users: [], //所有的用户列表
        // user = {
        //     "_id": "5cb05b4db6ed8c44f42c9af2",
        //     "username": "test",
        //     "password": "202cb962ac59075b964b07152d234b70",
        //     "phone": "123412342134",
        //     "email": "sd",
        //     "role_id": "5ca9eab0b49ef916541160d4",
        //     "create_time": 1555061581734,
        //     "__v": 0
        //   }
        roles: [], //所有角色的列表
        loading: false,
        isModalStatus: 0 //是否显示确认框 ， 0 ： 否 ， 1：是
    }

    title = (
        <Button
            type='primary'
            onClick={() => { this.setState({ isModalStatus: 1 }) }}>
            创建用户
        </Button>
    )

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: dateFormatter
            }, {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => (this.state.roles.find(role => role._id === role_id).name)
                render: (role_id) => this.roleNames[role_id]  //initRoleNames运行后已保存this.roleNames ,看initRoleNames
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <Button type='link' onClick={() => { this.showUpdateModal(user) }}>修改</Button>
                        <Button type='link' onClick={() => { this.deleteConfirm(user) }}>删除</Button>
                    </span>
                )
            }
        ]
    }

    //根据role的数组，生成包含所有角色名的对象（属性名用角色id值）
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        }, {})
        //保存
        this.roleNames = roleNames;
    }

    getUsers = async () => {
        this.setState({ loaing: true });
        const rs = await reqUsers();
        this.setState({ loaing: false });
        if (rs.status === 0) {
            const { users, roles } = rs.data;
            if (!this.roleNames) {
                this.initRoleNames(roles);
            }

            this.setState({ users, roles });
        }
    }

    //-----------------------modal-----------------------

    showUpdateModal = (user) => {
        this.user = user;
        this.setState({ isModalStatus: 1 });
    }

    handleModalOk = () => {
        //1. 收集数据
        this.form.validateFields().then(async (values) => {
            //2. 形成一个user对象
            const user = values;
            if (this.user) user._id = this.user._id;
            //3. 发送请求
            const rs = await reqAddOrUpdateUser(user);
            //4. 接受结果
            if (rs.status === 0) {
                //修改user
                if (user._id) {
                    message.success('修改用户名成功');
                    const updateUser = this.state.users.find(item => item._id === user._id);
                    //这里利用了指针 所以不用setState（{user}） 但是还是要刷新的
                    updateUser.username = user.username;
                    updateUser.phone = user.phone;
                    updateUser.role_id = user.role_id;
                    updateUser.email = user.email;
                    this.setState({
                        isModalStatus: 0
                    });
                    this.user = null;
                    //添加user
                } else {
                    message.success('创建用户名成功');
                    //5.刷新数据  + 6.关闭modal

                    //---------------------------这里的user 没有id 所以会出错 建议getUsers()-----------------------
                    // user.create_time = Date.now();
                    // this.setState({
                    //     users: [...this.state.users, user],
                    //     isModalStatus: 0
                    // });
                    //-------------------------------------------------------------------------------------------------------
                    this.getUsers();
                    this.setState({
                        isModalStatus: 0
                    });
                }
            } else if (rs.status === 1) {
                message.error(rs.msg);
            } else {
                message.error('创建用户名失败');
            }
        })



    }


    deleteConfirm = (user) => {
        Modal.confirm({
            title: `您确定要删除${user.username}?`,
            icon: <ExclamationCircleOutlined />,
            content: '删除后就不能还原啦！',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const rs = await reqDeleteUser(user._id);
                if (rs.status === 0) {
                    message.success('删除用户成功！');
                    const newUsers = this.state.users.filter((item) => user._id !== item._id);
                    this.setState({ users: newUsers });
                }
            }
        });
    }

    //-----------------------lifecycle-----------------------
    componentDidMount() {
        this.initColumns();
        this.getUsers();
    }


    render() {
        if (!this.columns) return <Loading />
        const { users, loading, isModalStatus, roles } = this.state;
        return (
            <div>
                <Card title={this.title} >
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={users}
                        columns={this.columns}
                        pagination={{ defaultPageSize: PAGE_SIZE, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: [3, 5, 10, 15] }}
                        //这个loading是获取数据的时候显示的 , 如果数据过大， 要获取的时间长就显示
                        loading={loading}
                    >

                    </Table>

                    {/* update and add - modal */}
                    <Modal title="添加用户"
                        okText="提交"
                        cancelText="取消"
                        visible={isModalStatus === 1}
                        onOk={this.handleModalOk} onCancel={() => { this.setState({ isModalStatus: 0 }); this.user = null; }}
                        destroyOnClose
                    >
                        {/* 这里的setform 等于 AuthForm didMount的时候 把它的form传到这里来 ， 我们会有this.form来使用 */}
                        <UserForm setForm={(form) => this.form = form} roles={roles} user={this.user} />
                    </Modal>

                </Card>
            </div>
        )
    }
}
