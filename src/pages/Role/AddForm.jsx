import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types';

const Item = Form.Item;

//解释可以看updateform

const AddForm = (props) => {
    const [form] = Form.useForm();


    // lifecycle
    useEffect(() => {
        //把form传给Category.jsx 来获取数据
        props.setForm(form);
    }, [form, props]);

    return (
        <Form form={form} initialValues={{ roleName: '' }}>
            <Item
                label='角色名称 : '
                name='roleName'
                rules={[
                    { required: true, whitespace: true, message: '角色名称是必须要输入的 !' }
                ]}
            >
                <Input placeholder='请输入分类名称' />
            </Item>
        </Form>
    )
}

AddForm.propTypes = {
    setForm: PropTypes.func.isRequired,
}


export default AddForm;