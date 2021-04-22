import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
import { getRandomNumber } from '../../utils/random';
import Loading from '../../components/Loading/Loading';

//柱状图路由


const getRandomNumberArr = (n) => {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(getRandomNumber(0, 500));
    }
    return arr;
}



export default class HomeLine extends Component {

    state = {
        data1: [], //邮件营销
        data2: [], //联盟广告
        data3: [], //视频广告
        data4: [], //直接访问
        data5: [], //搜索引擎
    }

    componentDidMount() {
        this.setState({
            data1: getRandomNumberArr(7), //邮件营销
            data2: getRandomNumberArr(7), //联盟广告
            data3: getRandomNumberArr(7), //视频广告
            data4: getRandomNumberArr(7), //直接访问
            data5: getRandomNumberArr(7), //搜索引擎
        })
    }


    getOption = (values) => {
        const option = {
            title: {
                text: '折线图堆叠'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '邮件营销',
                    type: 'line',
                    //stack: '总量',//数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
                    // smooth: true,
                    data: values.data1,
                    emphasis: { focus: 'series' }
                },
                {
                    name: '联盟广告',
                    type: 'line',
                    // stack: '总量',
                    // smooth: true,
                    data: values.data2,
                    emphasis: { focus: 'series' }
                },
                {
                    name: '视频广告',
                    type: 'line',
                    // stack: '总量',
                    // smooth: true,
                    data: values.data3,
                    emphasis: { focus: 'series' }
                },
                {
                    name: '直接访问',
                    type: 'line',
                    // stack: '总量',
                    // smooth: true,
                    data: values.data4,
                    emphasis: { focus: 'series' }
                },
                {
                    name: '搜索引擎',
                    type: 'line',
                    // stack: '总量',
                    // smooth: true,
                    data: values.data5,
                    emphasis: { focus: 'series' }
                }
            ]
        };
        return option;
    }


    render() {
        if (this.state.data1.length === 0) return <Loading />
        const values = { ...this.state }
        return (
            <>
                <ReactECharts option={this.getOption(values)} />
            </ >
        )

    }
}
