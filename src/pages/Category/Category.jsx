import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './AddForm'
import UpdateForm from './UpdateForm'
import Loading from '../../components/Loading/Loading'
// 商品分类路由

export default class Category extends Component {

    state = {
        categorys: [], //1级分类列表
        subCategorys: [], //2级分类列表
        loading: true,
        parentId: '0', //当前需要显示分类列表的父分类
        parentName: '', //当前需要显示分类列表的父分类
        isModalStatus: 0 //Modal显示 ， 0：为隐藏， 1：添加， 2：修改
    }

    //功能：2级列表 返回1级列表
    showCategory = () => {
        //把state里关于2级列表的数据都删了 下面render会自动check 然后返回1级列表
        this.setState({
            subCategorys: [],
            parentId: '0',
            parentName: '',
        });
    }

    showSubCategory = (category) => {
        //把subCategory的 parentId都确定
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, () => {
            //然后获取数据
            this.getCategory();
        });
    }

    initColumn = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                //这里我们的Table显示的每一行 都是state.categorys的一个对象 ， 而render可以帮我们把每一个对象都传进去，所以下面才有category
                render: (category) => (<>
                    <Button type='link' onClick={() => this.showUpdateModel(category)} >修改分类</Button>
                    {/* 这里我们获得了每一行的category ， 里面有_parentId, ..... 所以我们可以利用它 */}
                    {this.state.parentId === '0' ? <Button type='link' onClick={() => { this.showSubCategory(category) }} >查看子分类</Button> : null}
                </>)
            },
        ];
    }

    //这个可以重复用 获取1，2 级列表
    getCategory = async (parentId) => {
        //这是在获取之前， 由于数据可能过大所以会显示loading
        this.setState({ loading: true });
        //这里是替下面handleAddOk做处理 ， 由于render那里是根据 this.state.parentId 来渲染的， 所以如果
        //我们的parentId 和 this.state.parentId 不同 ， 数据会刷新， 但是页面时不会刷新的
        parentId = parentId || this.state.parentId;   // vd : '0' || '123456' , undefine || '123456'
        //根据parentId来确定 要获取的是1级还是2级的分类列表
        const rs = await reqCategorys(parentId);
        //这时候已经获取数据了 就不用显示loading了
        this.setState({ loading: false });
        //这里取出来的可能是1级的 也由于可能是2级的
        if (rs.status === 0) {
            const { data } = rs;
            //更新state里的1级分类列表
            if (parentId === '0')
                this.setState({ categorys: data });
            //更新state里的2级分类列表
            else
                this.setState({ subCategorys: data });
        } else {
            message.error('获取数据失败');
        }
    }

    componentDidMount() {
        this.initColumn();
        this.getCategory();
    }


    //---------------------------MODAL -------------------------------------
    //添加
    showAddModel = () => {
        this.setState({
            isModalStatus: 1
        })
    }

    handleAddOk = async () => {
        //进行表单验证，只有通过了才处理
        //this.form 是 从子组件（add form） didMount的时候传来的
        this.form.validateFields().then(async (values) => {
            // 1.隐藏modal
            this.setState({ isModalStatus: 0 });

            // const parentId = this.form.getFieldValue('categorySelect');
            // const categoryName = this.form.getFieldValue('categotyName');
            const { categorySelect: parentId, categoryName } = values;
            // 2.发送请求
            const rs = await reqAddCategory(parentId, categoryName);
            if (rs.status === 0) {
                //如果我在当前的分类列表 添加 =》要刷新 （例如：在一级分类点击添加 ，就要刷新数据来获取新数据 ）
                if (this.state.parentId === parentId) this.getCategory(); //刷新数据 ,这里没传参数 它会根据this.state.parentId来刷新
                //如果我在2级分类下添加1级分类 ， 然后我回到一级分类 ==》 要刷新 (要不然在一级分类的时候就看不到数据)
                else if (parentId === '0') this.getCategory("0"); //需要更改 parentId 的值 来刷新
                message.success('添加成功');
            } else {
                message.error('添加失败');
            }
        }).catch(err => console.log(err));
    }

    //取消
    handleModelCancel = () => {
        this.setState({
            isModalStatus: 0
        })
    }

    //修改
    showUpdateModel = (category) => {
        this.setState({
            isModalStatus: 2
        })

        this.category = category;
    }

    handleUpdateOk = async () => {
        //进行表单验证，只有通过了才处理
        this.form.validateFields().then(async (values) => {
            // 1.隐藏modal
            this.setState({ isModalStatus: 0 });
            // this.form 是 从子组件（UPDATE form） didMount的时候传来的
            const categoryId = this.category._id;
            // const categoryName = this.form.getFieldValue('categoryName');
            const { categoryName } = values;
            // 2.发送请求
            const result = await reqUpdateCategory({ categoryId, categoryName });
            if (result.status === 0) {
                // 3.刷新数据
                this.getCategory();
                message.success('修改成功');
            } else {
                message.error('修改失败');
            }
        }).catch(err => console.log(err));


    }



    render() {

        //第一次render还没有数据 , 是要显示loading的
        if (!this.columns) {
            return <Loading />
        } else {
            const { categorys, loading, subCategorys, parentId, parentName, isModalStatus } = this.state;
            const title = parentId === '0' ? "一级分类列表" : (
                <span>
                    {/* 点击返回一级列表 */}
                    <Button type='link' onClick={this.showCategory}>一级分类列表</Button>
                    <ArrowRightOutlined style={{ marginRight: '10px' }} />
                    {parentName}
                </span>
            );
            const extra = <Button type='primary' icon={<PlusOutlined />} onClick={this.showAddModel}> 添加</Button >;
            const category = this.category || {};
            return (
                <div>
                    {/* show data */}
                    <Card title={title} extra={extra} >
                        <Table
                            bordered rowKey='_id'
                            dataSource={parentId === '0' ? categorys : subCategorys} columns={this.columns}
                            pagination={{ defaultPageSize: 5, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: [5, 10, 15, 20, 50, 100] }}
                            //这个loading是获取数据的时候显示的 , 如果数据过大， 要获取的时间长就显示
                            loading={loading}
                        />;
                    </Card>

                    {/* add form - modal */}
                    <Modal title="添加分类"
                        okText="提交"
                        cancelText="取消"
                        visible={isModalStatus === 1}
                        onOk={this.handleAddOk} onCancel={this.handleModelCancel}
                        destroyOnClose
                    >
                        {/* 这里的setform 等于 AddForm didMount的时候 把它的form传到这里来 ， 我们会有this.form来使用 */}
                        <AddForm categorys={categorys} parentId={parentId} setForm={form => this.form = form} />
                    </Modal>

                    {/* update form - modal */}
                    <Modal title="修改分类"
                        visible={isModalStatus === 2}
                        okText="提交"
                        cancelText="取消"
                        onOk={this.handleUpdateOk}
                        onCancel={this.handleModelCancel}
                        destroyOnClose
                    >
                        {/* 这里的setform 等于 UpdateForm didMount的时候 把它的form传到这里来 ， 我们会有this.form来使用 */}
                        <UpdateForm categoryName={category.name} setForm={(form) => this.form = form} />
                    </Modal>
                </div>
            )
        }
    }
}
