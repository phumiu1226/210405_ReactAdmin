import React from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;



const UpdateForm = (props) => {

    //useform 只能在 function component 使用
    const [form] = Form.useForm();
    const { categoryName } = props;


    //lifecycle , []代表只运行一次 componentDidMount , return的函数代表 componentWillUnmount
    React.useEffect(() => {
        props.setForm(form);
        // return () => {
        //     const newCategotyName = form.getFieldValue('categotyName');
        //}
    }, [form, props]);


    return (
        <Form
            form={form}
            initialValues={{ categoryName }}
        >
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

UpdateForm.propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
}

UpdateForm.defaultProps = {
    categoryName: ""
}

export default UpdateForm;

