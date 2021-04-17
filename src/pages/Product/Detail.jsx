import React, { Component } from 'react';
import { Card, List, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const Item = List.Item

export default class Detail extends Component {
    state = {
        cName1: '', //一级分类名称
        cName2: '', //二级分类名称
    }

    async componentDidMount() {
        //得到当前商品的分类Id
        const { pCategoryId, categoryId } = this.props.location.state.product;
        if (pCategoryId === '0') {//一级分类下的商品
            const rs = await reqCategory(categoryId);
            const cName1 = rs.data.name;
            this.setState({ cName1 });
        } else {//二级分类下的商品

            /*
            //通过多个await方式发送请求：后面一个请求是在前一个请求成功之后才发送 =》不好
            const rs1 = await reqCategory(pCategoryId);
            const rs2 = await reqCategory(categoryId);
            const cName1 = rs1.data.name;
            const cName2 = rs2.data.name;
            */

            //一次性发送多个请求，只有都成功了，才正常处理
            const rs = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
            const cName1 = rs[0].data.name;
            const cName2 = rs[1].data.name;
            this.setState({ cName1, cName2 });
        }
    }

    render() {

        //读取携带过来的state数据
        const { name, desc, price, detail, imgs } = this.props.location.state.product;
        const { cName1, cName2 } = this.state;
        const title = (
            <span>
                <Button type='link' onClick={() => { this.props.history.goBack() }}>
                    <ArrowLeftOutlined style={{ fontSize: '20px', color: '#1DA57A' }} />
                </Button>

                <span style={{ fontSize: '20px', marginLeft: '10px' }}>商品详情</span>
            </span>
        )

        return (
            <div>
                <Card title={title} className='product-detail'>
                    <List >
                        <Item>
                            <div>
                                <span className="left">商品名称：</span>
                                <span >{name}</span>
                            </div>
                        </Item>
                        <Item>
                            <div>
                                <span className="left">商品描述：</span>
                                <span >{desc}</span>
                            </div>
                        </Item>
                        <Item>
                            <div>
                                <span className="left">商品价格：</span>
                                <span >{price}</span>
                            </div>
                        </Item>
                        <Item>
                            <div>
                                <span className="left">所属分类：</span>
                                {/* <span dangerouslySetInnerHTML={{ __html: cName1 + (cName2 !== '' ? <ArrowRightOutlined /> + cName2 : null) }} ></span> */}
                                <span>{cName1} {cName2 !== '' ? ' => ' + cName2 : null} </span>
                            </div>
                        </Item>
                        <Item>
                            <div>
                                <span className="left">商品图片：</span>
                                <span >
                                    {
                                        imgs.map(img => {
                                            return (<img
                                                key={img}
                                                src={BASE_IMG_URL + img}
                                                className='product-images'
                                                alt="images" />)
                                        })
                                    }

                                </span>
                            </div>
                        </Item>
                        <Item>
                            <div className='product-detail-content'>
                                <span className="left">商品详情：</span>
                                {/* 这里要使用html标签所以要加dangerouslySetInnerHTML , 2个_  */}
                                <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                            </div>
                        </Item>
                    </List>
                </Card>
            </div>
        )
    }
}
