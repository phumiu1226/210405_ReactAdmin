import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css' //样式
import PropTypes from 'prop-types';



export default class RichTextEditor extends Component {

  constructor(props) {
    super(props);

    const html = this.props.detail;
    if (html) { //如果有值根据HTML格式字串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState
        }
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
      }
    }

  }

  state = {
    editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
  }


  getDetail = () => {
    //返回输入数据对应的html格式文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  //输入过程中实时的回调
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  uploadImageCallBack = (file) => {
    console.log(file);
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/apiPort5000/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          const url = response.data.url //得到图片地址
          resolve({ data: { link: url } });
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          //wrapperClassName="demo-wrapper" //指定类名 给类设置样式
          //editorClassName="demo-editor"//指定类名 给类设置样式
          editorStyle={{ border: '1px solid #000', minHeight: 200, paddingLeft: 10, cursor: 'text' }}
          onEditorStateChange={this.onEditorStateChange} //监听
          toolbar={{
            image: {
              uploadCallback: this.uploadImageCallBack,
              alt: {
                present: true, mandatory: false,
                inputAccept: 'image/*'
              }
            },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}


RichTextEditor.propTypes = {
  detail: PropTypes.string
}