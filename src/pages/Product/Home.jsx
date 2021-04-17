import React, { Component } from 'react'
import {
    Card,
    Select,
    Button,
    Table,
    Input,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import PAGE_NUM, { PAGE_SIZE } from '../../utils/constants' //PAGE_NUM 用来记住 每次换页 的页数 这个值把它传给this.pageNum
import Loading from '../../components/Loading/Loading'


const Option = Select.Option;

export default class Home extends Component {

    state = {
        total: 0,
        products: [], //商品的数组
        loading: false,
    }

    //不放在state因为每次输入或点击都在render
    searchText = ''; //搜索的关键字
    searchType = 'productName';//根据哪个字段搜索

    //初始化 table的comlumn
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                width: 100,
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price // 指定了对应的属性，传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                // render: (status) =>    //这里如果没有 dataIndex 我们的没一行都是根据product来获取数据
                render: (product) => {
                    const { status, _id } = product;
                    const newStatus = status === 1 ? 2 : 1;
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => { this.updateStatus(_id, newStatus) }
                                }
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <Button type='link' onClick={() => {
                                this.props.history.push('/product/detail', { product });
                                PAGE_NUM.data = this.pageNum;  //把当前的页数 记住 ， 返回的时候 用来刷到 当前页 ， 要是没记住 返回的时后会直接到商品的第一页
                            }}>详情</Button>
                            <Button type='link' onClick={() => {
                                this.props.history.push('/product/add-update', { product });
                                PAGE_NUM.data = this.pageNum;  //把当前的页数 记住 ， 返回的时候 用来刷到 当前页 ， 要是没记住 返回的时后会直接到商品的第一页
                            }}>修改</Button>
                        </span>
                    )
                }
            },
        ];
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum; //保存pageNum，让其他方法都可以看到 ， 刷新的时候数据就不会变成第一页了s
        this.setState({ loading: true }); //显示loading

        //分出来 有一般请求获取数据 和 搜索数据
        const { searchText, searchType } = this
        //一般请求
        let rs;
        if (searchText === "") {
            //这里的PAGE_SIZE 一定要与 Table的pagination相同 ， 要不会导致数据丢失
            rs = await reqProducts(pageNum, PAGE_SIZE);
        } else {//搜索数据
            rs = await reqSearchProducts(pageNum, PAGE_SIZE, searchText, searchType);
        }


        this.setState({ loading: false });//隐藏loading
        if (rs.status === 0) {
            const { total, list } = rs.data;
            this.setState({
                total,
                products: list
            });
        }
    }

    //更新指定商品状态
    updateStatus = async (productId, status) => {
        const rs = await reqUpdateStatus(productId, status);
        if (rs.status === 0) {
            message.success('更新商品状态成功');
            this.getProducts(this.pageNum); //刷新当前页面来获取更新状态
        } else {
            message.error('更新商品状态失败');
        }
    }

    componentDidMount() {
        this.pageNum = PAGE_NUM.data; //PAGE_NUM 会记住我们已经到哪哪一页 从而刷新的时候 商品列表不会跳回第1页
        this.initColumns();
        this.getProducts(this.pageNum);

    }

    render() {
        //取出state里的数据
        const { products, loading, total } = this.state;
        const { searchType, pageNum: defaultPageNum } = this;
        const title = (
            <span>
                {/* 这里的onchange是由antd的Select提供 */}
                <Select defaultValue={searchType} onChange={value => this.searchType = value}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字'
                    style={{ width: '150px', margin: '0 10px' }}
                    onChange={e => this.searchText = e.target.value}
                />
                <Button type='primary' onClick={() => { this.getProducts(1) }}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/add-update')} icon={<PlusOutlined />}>添加商品</Button>
        )


        if (!this.columns) {
            return <Loading />
        } else {
            //渲染
            return (
                <Card title={title} extra={extra}>
                    <Table dataSource={products} columns={this.columns}
                        rowKey='_id' //rowkey 指定了 数据里(products)的 _id
                        loading={loading}
                        bordered
                        pagination={{
                            defaultCurrent: defaultPageNum,
                            current: this.pageNum,
                            total: total,
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: (pageNum, pageSize) => {
                                // 这里的pageNum和pageSize是根据 Pagination的， 而不是我们的
                                this.getProducts(pageNum);
                            }
                        }}
                    />;
                </Card>
            )
        }


    }
}
