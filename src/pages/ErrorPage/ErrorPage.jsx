import React, { Component } from 'react'
import { Button } from 'antd'
import './ErrorPage.less'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { setHeadTitle } from '../../redux/actions'

class ErrorPage extends Component {
    render() {
        return (
            <div className='error-container'>
                <div className='error-left'>

                </div>
                <div className='error-right'>
                    <span className='error-title'>404</span>
                    <div>
                        <span className='error-content'>抱歉，你访问的页面不存在</span>
                        <Button type='primary' onClick={() => {
                            this.props.setHeadTitle('首页');
                            this.props.history.replace('/home');
                        }}>回到首页</Button>
                    </div>
                </div>

            </div >
        )
    }
}


export default connect(
    state => ({}),
    { setHeadTitle }
)(withRouter(ErrorPage));