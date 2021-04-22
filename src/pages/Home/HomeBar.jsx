import React, { Component } from 'react'
import ReactECharts from 'echarts-for-react';
import { getRandomNumber } from '../../utils/random';

//柱状图路由

export default class HomeBar extends Component {
    state = {
        data1: [120, 200, 150, 80, 70, 110, 99, 55, 22, 33, 44, 15],
    }

    getOption = (data1, data2) => {
        return ({
            title: {
                // text: 'Echarts 入门实列',
                // subtext: '商品图形',
                // sublink: 'http://e.weibo.com/1341556070/AjQH99che'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top: '3%',
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                splitLine: { show: false },
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',]
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: data1,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    label: {
                        show: true,
                        position: 'inside'
                    },
                },
            ]
        });
    }

    refreshData = () => {

        this.setState(state => ({
            data1: state.data1.map(value => getRandomNumber(0, 500)),
        }))
    }

    render() {
        const { data1, data2 } = this.state;
        return <ReactECharts option={this.getOption(data1, data2)} />

    }
}
