import React, { Component } from 'react'
import Loading from '../../components/Loading/Loading'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './AddForm'
import AuthForm from './AuthForm'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
import { dateFormatter } from '../../utils/dateUtils'

import { connect } from 'react-redux'
import { logout } from '../../redux/actions'

// 角色管理路由


class Role extends Component {

    //-------------------------初始化--------------------------------
    state = {
        roles: [
            // {
            //     "menus": [
            //         "/role",
            //         "/charts/bar",
            //         "/home",
            //         "/category"
            //     ],
            //     "_id": "5ca9eaa1b49ef916541160d3",
            //     "name": "测试",
            //     "create_time": 1554639521749,
            //     "__v": 0,
            //     "auth_time": 1558679920395,
            //     "auth_name": "test007"
            // },
        ],
        role: {}, //选中的role
        loading: false,
        isModalStatus: 0, // 0 : visible , 1 : 添加角色modal ， 2 : 设置角色权限
    }



    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => dateFormatter(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: dateFormatter
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }

    //点击行事件处理
    onRow = (role) => {
        return {
            onClick: event => {
                //这里获取数组roles的地址 ， 发给role变量
                this.setState({ role });
            },
        }
    }

    //点击radio图标 处理 , 因为没这处理点击图标时可能 会与onRow冲突 所以要写这函数
    rowSelectionChange = (selectedRowKeys, selectedRows) => {
        this.setState({ role: selectedRows[0] });
    }

    getRoles = async () => {
        this.setState({ loading: true });
        const rs = await reqRoles();
        this.setState({ loading: false });
        if (rs.status === 0) {
            const roles = rs.data;
            this.setState({ roles });
        }

    }

    //-----------------------Modal-----------------------
    handleModelCancel = () => {
        this.setState({ isModalStatus: 0 });
    }

    //添加 - AddForm
    handleAddOk = () => {
        //this.form 是 从子组件（add form） didMount的时候传来的
        this.form.validateFields().then(async (values) => {
            // 1.隐藏modal
            this.setState({ isModalStatus: 0 });
            // 2.获取数据
            const { roleName } = values;
            // 3.发送请求
            const rs = await reqAddRole(roleName);
            //4.完成之后
            if (rs.status === 0) {
                message.success('添加角色成功');
                //有2中刷新方法 ： 
                //1.访问服务器 获取数据 =》 不推荐 ，因为效率问题 ， 我们不应该经常访问服务器
                // this.getRoles();
                //2. 直接保存到state

                //-------2种setState
                // const { roles } = this.state;
                // const role = rs.data;
                // this.setState({ roles: [...roles, role] }); //这里必须要创建一个新的数组

                const role = rs.data;
                this.setState(state => ({
                    roles: [...state.roles, role]
                }));

            } else {
                message.error('添加角色失败');
            }
        });
    }

    //设置角色权限 - AuthForm
    handleUpdateOk = async () => {
        this.setState({ isModalStatus: 0 });

        //这里其实role时对象的引用变量 , 说白了就时 this.state.role 只有一份  ==> role ===this.state.role 
        //这个role其实时数组roles的 role , 看onRow那里
        const { role } = this.state;
        role.menus = this.checkedRoles;
        role.auth_time = Date.now();
        // role.auth_name = memoryUtils.user.username;
        role.auth_name = this.props.user.username;

        const rs = await reqUpdateRole(role);
        if (rs.status === 0) {
            //如果当前更新的是自己角色的的权限，就强制退出
            if (role._id === this.props.user.role_id) {
                // memoryUtils.user = {};
                // storageUtils.removeUser();
                // this.props.history.replace('/login');
                this.props.logout();

                message.success('当前用户角色权限修改了，请重新登录');
            } else {
                //do van de con tro, nen o day da~ roles va role o state da update san~
                message.success('设置角色权限成功');
                this.forceUpdate();
            }


        } else {
            message.error('设置角色权限失败');
        }

    }

    //------------------------lifecycle ----------------------
    componentDidMount() {
        this.initColumn();
        this.getRoles();
    }

    render() {

        if (!this.columns) return <Loading />

        const { roles, loading, role, isModalStatus } = this.state;

        const title = (
            <span>
                <Button type='primary' onClick={() => { this.setState({ isModalStatus: 1 }) }}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' onClick={() => { this.setState({ isModalStatus: 2 }) }} disabled={!role._id}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: [5, 10, 15] }}
                    //这个loading是获取数据的时候显示的 , 如果数据过大， 要获取的时间长就显示
                    loading={loading}
                    //selectedRowKeys ：指定选中项的keys数组 ， 需要和onChange配合
                    rowSelection={{ type: 'radio', selectedRowKeys: [role._id], onChange: this.rowSelectionChange }}
                    onRow={this.onRow}
                >

                </Table>

                {/* add form - AddForm - modal */}
                <Modal title="添加角色"
                    okText="提交"
                    cancelText="取消"
                    visible={isModalStatus === 1}
                    onOk={this.handleAddOk} onCancel={this.handleModelCancel}
                    destroyOnClose
                >
                    {/* 这里的setform 等于 AddForm didMount的时候 把它的form传到这里来 ， 我们会有this.form来使用 */}
                    <AddForm setForm={form => this.form = form} />
                </Modal>

                {/* update Role form - AuthForm - modal */}
                <Modal title="设置角色权限"
                    okText="提交"
                    cancelText="取消"
                    visible={isModalStatus === 2}
                    onOk={this.handleUpdateOk} onCancel={this.handleModelCancel}
                    destroyOnClose
                >
                    {/* 这里的setform 等于 AuthForm didMount的时候 把它的form传到这里来 ， 我们会有this.form来使用 */}
                    <AuthForm role={role} checkedRoles={(roleNames) => { this.checkedRoles = roleNames }} />
                </Modal>
            </Card>
        )
    }
}





export default connect(
    state => ({ user: state.user }),
    { logout }
)(Role);