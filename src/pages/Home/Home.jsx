import React, { Component } from 'react'
import { Card, Statistic, DatePicker, Timeline } from 'antd'
import { QuestionCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons';
import './Home.less'
import HomeLine from './HomeLine';
import HomeBar from './HomeBar';
import moment from 'moment';

// 首页路由

const { RangePicker } = DatePicker;

const HomeBarRef = React.createRef();

export default class Home extends Component {

    state = {
        isVisited: true,
    }



    contentTitleClick = (bool) => {
        this.setState(state => ({ isVisited: bool }));
        this.reLoadBar();
    }

    contentExtra = (
        <RangePicker
            defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
            format={'YYYY/MM/DD'}
        />
    )

    reLoadBar = () => {
        HomeBarRef.current.refreshData();
    }

    render() {

        const contentTitle = (
            <>
                <span onClick={() => { this.contentTitleClick(true) }} className={this.state.isVisited ? 'home-content-title active' : 'home-content-title'}>
                    访问量
                </span>
                <span onClick={() => { this.contentTitleClick(false) }} className={!this.state.isVisited ? 'home-content-title active' : 'home-content-title'}>
                    销售量
                </span>
            </>
        )

        return (
            <div className='home-container'>
                <div className='home-left'>
                    <Card title="商品总量" extra={<QuestionCircleOutlined />} headStyle={{ color: 'rgba(0,0,0,.45)' }} style={{ width: '300px' }}>
                        <Statistic
                            value={1122893}
                            suffix="个"
                            style={{ fontWeight: 'bold' }}
                        />
                        <Statistic
                            // title="Active"
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: '#3f8600', fontSize: 15 }}
                            prefix={'周同比'}
                            suffix={<div>%<ArrowUpOutlined /></div>}
                        />
                        <Statistic
                            // title="Active"
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: '#cf1322', fontSize: 15 }}
                            prefix={'周同比'}
                            suffix={<div>%<ArrowDownOutlined /></div>}
                        />

                    </Card>
                </div>
                <div className='home-right'>
                    <HomeLine />
                </div>

                <div className='home-content'>
                    <Card title={contentTitle} extra={this.contentExtra}>
                        <div className='home-content-container'>
                            <div className='home-content-left'>
                                <Card
                                    title={this.state.isVisited ? '访问趋势' : '销售趋势'}
                                    extra={<ReloadOutlined onClick={this.reLoadBar} style={{ cursor: 'pointer' }} />}
                                    style={{ maxWidth: '90%' }}
                                >
                                    <HomeBar ref={HomeBarRef} barName={this.state.isVisited ? '访问趋势' : '销售趋势'} />
                                </Card>
                            </div>

                            <div className='home-content-right'>
                                <Card
                                    title="任务"
                                    extra={<ReloadOutlined style={{ cursor: 'pointer' }} />}
                                    style={{ minWidth: '90%', maxWidth: '90%', float: 'right' }}
                                >
                                    <Timeline>
                                        <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                                        <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                                        <Timeline.Item color="red">
                                            <p>Solve initial network problems 1</p>
                                            <p>Solve initial network problems 2</p>
                                            <p>Solve initial network problems 3 2015-09-01</p>
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </Timeline.Item>
                                        <Timeline.Item color="gray">
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </Timeline.Item>
                                        <Timeline.Item color="gray">
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </Timeline.Item>
                                    </Timeline>
                                </Card>
                            </div>
                        </div>
                    </Card>
                </div>


            </div>
        )
    }
}
