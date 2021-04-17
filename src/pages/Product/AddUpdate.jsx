import React, { PureComponent } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqCategorys } from '../../api'
import Loading from '../../components/Loading/Loading'
import PicturesWall from './PicturesWall'
import RichTextEditor from './RichTextEditor'
import { reqAddOrUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input

//指定Item布局的配置对象 , 总共有24格
const formItemLayout = {
    labelCol: { span: 2 }, //左侧label占据的宽度
    wrapperCol: { span: 8 }, //右侧组件占据的宽度
}


//product object
/*
{
    "status": 2,
    "imgs": [],
    "_id": "6071929196b94d1784c4edb7",
    "categoryId": "606ff346868fb64b5cfd7276",
    "pCategoryId": "0",
    "name": "商品A",
    "desc": "一个笔记本",
    "price": 1523,
    "detail": "一个笔记本的传说",
    "__v": 0
}
*/



export default class AddUpdate extends PureComponent {
    pw = React.createRef();
    editor = React.createRef();
    state = {
        options: [],  //{value: 'jiangsu2',label: 'Jiangsu2',isLeaf: true,}
    }

    initOptions = async (categorys) => {
        //根据categorys 生成options数组
        const options = categorys.map(c => ({
            value: c._id, label: c.name, isLeaf: false
        }))

        //如果是修改 ： 先取个一级出来 再出个2级来default select options
        if (this.isUpdate) {
            //取出这2个值来确定我们要的是2级还是 1级分类
            const { pCategoryId } = this.product;
            if (pCategoryId !== '0') {
                //获取对应的2级分类表
                const subCategorys = await this.getCategorys(pCategoryId);
                const subOptions = subCategorys.map(c =>
                    ({ value: c._id, label: c.name, isLeaf: true, })
                )
                // 找到对应的options , 把它的children赋上去
                const targetOption = options.find(option => option.value === pCategoryId);
                targetOption.children = subOptions;
            }
        }

        //更新options状态
        this.setState({
            options
        })
    }

    //获取一级分类列表 ， 也可能获取二级分类列表
    getCategorys = async (parentId) => {
        const rs = await reqCategorys(parentId)
        if (rs.status === 0) {
            const categorys = rs.data;
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys);
            } else {
                //如果是二级分类列表
                return categorys; //返回二级列表 让loadData处理 =》 当前async函数返回的promise就会成功且value为categorys
            }

        }
    }

    //Cascader 的loadData
    loadData = async (selectedOptions) => {
        //这里我们只有2级Cascader ， 所以
        //targetOption : 正在选择的1级option ， 如果我们是3级Cascader ， 那么我们选择的可能是1级option , 也有可能是2级option
        const targetOption = selectedOptions[selectedOptions.length - 1]; //  electedOptions.length - 1 ; 这里其实 = 0
        //显示loading
        targetOption.loading = true;

        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value); // targetOption的结构  = {value: 'jiangsu2',label: 'Jiangsu2',isLeaf: true}
        //我们指定的option 加载给它 children
        if (subCategorys && subCategorys.length > 0) {
            //生成一个2级分类列表s
            const subOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            //关联到当前option上
            targetOption.children = subOptions;
        } else {//当前选中的分类没有2级分类
            targetOption.isLeaf = true;
        }

        targetOption.loading = false;

        // [...this.state.options] 这里的 this.state.options 其实已经被改过了， 添加了children进去 ， 但是它又没render， 所以我们才有下面那行
        //刷新数据
        this.setState({ options: [...this.state.options] });

    }


    //验证价格的自定义函数
    validatePrice = (rule, value) => {
        if ((value * 1) < 1)
            return Promise.reject('价格不能少于0');
        else
            return Promise.resolve();
    }

    //验证失败
    onFinishFailed = (err) => {
        message.error('请填补商品信息！');
    }

    //验证成功
    onFinish = async (values) => {

        //1.收集数据,并封装成product对象
        const { categoryIds, productDesc: desc, productName: name, productPrice: price } = values;
        //把categoryIds 分出来
        let pCategoryId = '0', categoryId;
        if (categoryIds.length === 1)
            categoryId = categoryIds[0];
        else {
            pCategoryId = categoryIds[0];
            categoryId = categoryIds[1];

        }
        const imgs = this.pw.current.getImgs();
        const detail = this.editor.current.getDetail();
        //封装
        const product = { categoryId, pCategoryId, name, desc, price, imgs, detail };
        if (this.isUpdate) {
            product._id = this.product.id;
        }

        //2.调用接口请求函数去添加/修改
        const rs = await reqAddOrUpdateProduct(product);

        //3.根据结果提示
        if (rs.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`);
            this.props.history.goBack();
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`);
        }

    }

    componentDidMount() {
        let product;
        if (this.props.location.state)
            product = this.props.location.state.product; //如果是添加就没值 ,
        this.isUpdate = !!product;     //!!有值 => true
        this.product = product || {} //这里的product如果是 修改就有值 (保存来初始化) ， 如果是添加就给个空object

        //初始化options
        //如果是修改 ： 先取个一级出来 再出个2级来default select options
        this.getCategorys('0');
    }


    render() {
        if (this.isUpdate === undefined) return <Loading />
        else {
            const title = (
                <span>
                    <Button type='link' onClick={() => { this.props.history.goBack() }}>
                        <ArrowLeftOutlined style={{ fontSize: '20px', color: '#1DA57A' }} />
                    </Button>

                    <span style={{ fontSize: '20px', marginLeft: '10px' }}>{this.isUpdate === true ? '修改商品' : '添加商品'}</span>
                </span>
            )

            return (
                <Card title={title}>
                    <Form
                        {...formItemLayout}
                        initialValues={{
                            productName: this.product.name,
                            productDesc: this.product.desc,
                            productPrice: this.product.price,
                            //情况是 如果是修改 分出来product是一级或者二级分类的 ， 如果是添加 就是空数组
                            categoryIds: this.isUpdate ?
                                (this.product.pCategoryId === '0' ? [this.product.categoryId] : [this.product.pCategoryId, this.product.categoryId])
                                : [],
                        }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Item
                            label='商品名称'
                            name='productName'
                            rules={[{ required: true, whitespace: true, message: '商品名称不能为空!' }]}
                        >
                            <Input placeholder='请输入商品名称' />
                        </Item>

                        <Item
                            label='商品描述'
                            name='productDesc'
                            rules={[{ required: true, whitespace: true, message: '商品描述不能为空!' }]}
                        >
                            <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />
                        </Item>

                        <Item
                            label='商品价格'
                            name='productPrice'
                            rules={[
                                { required: true, whitespace: true, message: '商品描述不能为空!' },
                                { validator: this.validatePrice }
                            ]}>
                            <Input type='number' addonAfter='元' placeholder='请输入商品价格' />
                        </Item>

                        <Item label='商品分类' name='categoryIds'>
                            <Cascader
                                placeholder='请选择分类'
                                options={this.state.options} //需要显示的列表数据数组
                                loadData={this.loadData} //当选择某个列表，加载下一级列表的回调
                                rules={[{ required: true, message: '必须指定商品分类' }]}
                            />
                        </Item>

                        <Item label='商品图片'>
                            <PicturesWall ref={this.pw} imgs={this.product.imgs} />
                        </Item>

                        <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }} >
                            <RichTextEditor ref={this.editor} detail={this.product.detail} />
                        </Item>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button style={{ textAlign: 'center' }} type='primary' htmlType="submit">提交</Button>
                        </div>
                    </Form>
                </Card>
            )
        }

    }
}



