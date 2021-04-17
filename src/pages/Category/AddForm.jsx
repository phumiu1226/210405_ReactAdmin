import React, { useEffect } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types';

const Item = Form.Item;
const Option = Select.Option;

//解释可以看updateform

const AddForm = (props) => {
    const [form] = Form.useForm();
    const { categorys, parentId } = props;

    // lifecycle
    useEffect(() => {
        //把form传给Category.jsx 来获取数据
        props.setForm(form);
    }, [form, props]);

    return (
        <Form form={form} initialValues={{ categorySelect: parentId }}>
            <Item name="categorySelect">
                <Select >
                    <Option value='0'>一级分类</Option>
                    {
                        //渲染一级分类到option
                        categorys.map(item => {
                            return (
                                <Option key={item._id} value={item._id}>{item.name}</Option>
                            )
                        })
                    }
                </Select>
            </Item>

            <Item name='categoryName'
                rules={[
                    { required: true, whitespace: true, message: '分类名称是必须要输入的 !' }
                ]}
            >
                <Input placeholder='请输入分类名称' />
            </Item>
        </Form>
    )
}

AddForm.propTypes = {
    categorys: PropTypes.array.isRequired, //一级分类的数组
    parentId: PropTypes.string.isRequired //点击的 父分类ID
}

AddForm.defaultProps = {
    categorys: [],
    parentId: "0"
}

export default AddForm;