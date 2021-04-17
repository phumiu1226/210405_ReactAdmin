import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api'
import PropTypes from 'prop-types';
import { BASE_IMG_URL } from '../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends Component {
    constructor(props) {
        super(props);
        let fileList = [];
        //如果传入imgs属性
        const { imgs } = this.props;
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + '' + img,
            }))
        }
        this.state = {
            previewVisible: false, //表示是否显示图预览界面Modal
            previewImage: '', //点击时 modal显示的大图的url
            previewTitle: '',
            fileList
            // {
            //     uid: '-1', //文件的唯一标识 ， 建议设置为负数，防止和内部参数id冲突
            //     name: 'image.png', //文件名
            //     status: 'done', //状态 有 uploading-正在上传中 ， error-错误 ，done-已上传 , removed-已删除
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', //图片地址
            // }
        };
    }


    //获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name);
    }


    //隐藏modal
    handleCancel = () => this.setState({ previewVisible: false });

    //显示指定file对应的大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    // file: 当前操作的图片文件（上传/删除）
    // fileList: 所以已上传图片文件对象的数组
    handleChange = async ({ file, fileList }) => {
        //file 其实 === fileList[ fileList.length-1 ]  , 2个做的同一样信息的对象（属性同） ， 当不同对象 ， 不同值, 所以下面的我们要改 fileList最后一个的值 === file
        // console.log(file.status, fileList.length, file);

        //一旦上传成功了， 将当前上传的file的信息修正（name,url）
        if (file.status === 'done') {
            const rs = file.response; // {status : 0 , data : {name:'xx.jpg' , url : '图片地址'} }
            if (rs.status === 0) {
                message.success('上传图片成功！');
                const { name, url } = rs.data;
                file = fileList[fileList.length - 1];
                file.name = name;
                file.url = url;
            } else {
                message.error('上传图片失败！');
            }
        } else if (file.status === 'removed') {//删除图片
            const rs = await reqDeleteImg(file.name);
            if (rs.status === 0) {
                message.success('删除图片成功！');
            } else {
                message.error('删除图片失败！');
            }
        }

        //在操作过程中（上传/删除） 更新fileList状态
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    accept='image/*' //只接受图片格式
                    action="/apiPort5000/manage/img/upload" //上传图片的接口地址
                    listType="picture-card"  //显示样式
                    fileList={fileList}
                    name='image' //请求参数名  要与后台的 api 的 image 相同
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}


PicturesWall.propTypes = {
    imgs: PropTypes.array,
}

export default PicturesWall;