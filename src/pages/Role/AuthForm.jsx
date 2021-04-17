import React, { useEffect, useState } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types';
import menuList from '../../config/menuConfig';


const Item = Form.Item;


//初始化数据啊
const getTreeNodes = (menuList) => {
    const list = menuList.map(item => {
        const node = {};
        node.title = item.title;
        node.key = item.key;
        if (item.children) {
            node.children = getTreeNodes(item.children);
        }
        return node;
    });
    return list;
}
//初始化数据啊
const treeData = [{
    title: '平台权限',
    key: '/atguigu'
}];
treeData[0].children = getTreeNodes(menuList);


const AuthForm = (props) => {
    const { name, menus } = props.role;

    const [checkedKeys, setCheckedKeys] = useState(menus);

    //点击文字进行处理事件
    // const onSelect = (selectedKeys, info) => {
    //     console.log(info.node.key);
    //     setCheckedKeys(checkedKeys);
    // };

    //点击勾选进行处理 checkedKeys:已勾的keys
    const onCheck = (checkedKeys, info) => {
        setCheckedKeys(checkedKeys);
    };

    //didmount的时候 把form传给 Role
    useEffect(() => {
        props.checkedRoles([...checkedKeys]);
    });


    return (
        <Form initialValues={{ roleName: name }}>
            <Item
                label='角色名称 : '
                name='roleName'
            >
                <Input placeholder='请输入分类名称' disabled />
            </Item>

            <Tree
                checkable
                defaultExpandAll={true}
                // defaultExpandedKeys={['0-0-0', '0-0-1']} //默认展开指定的树节点
                // defaultSelectedKeys={['0-0-0', '0-0-1']} //默认选中的树节点
                //defaultCheckedKeys={checkedKeys} //默认选中复选框的树节点

                // onSelect={onSelect} //点击文字进行处理事件
                checkedKeys={checkedKeys}
                onCheck={onCheck} //点击勾选进行处理
                treeData={treeData}
            />

        </Form>
    )

}

AuthForm.propTypes = {
    role: PropTypes.object.isRequired,
}




export default AuthForm;