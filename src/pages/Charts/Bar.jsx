import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactECharts from 'echarts-for-react';
import { getRandomNumber } from '../../utils/random';

//柱状图路由

export default class Bar extends Component {
    state = {
        data1: [120, 200, 150, 80, 70, 110],
        data2: [300, 270, 30, 150, 22, 75]
    }

    getOption = (data1, data2) => {
        return ({
            title: {
                text: 'Echarts 入门实列',
                // subtext: '商品图形',
                // sublink: 'http://e.weibo.com/1341556070/AjQH99che'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    let tar1 = params[1];
                    let tar0 = params[0];
                    return tar1.name + '<br/>'
                        + tar0.seriesName + ' : ' + tar0.value + '<br/>'
                        + tar1.seriesName + ' : ' + tar1.value;
                }
            },
            grid: {
                left: '5%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                splitLine: { show: false },
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '上个月',
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
                {
                    name: '这个月',
                    data: data2,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    label: {
                        show: true,
                        position: 'inside'
                    },
                }
            ]
        });
    }

    refreshData = () => {

        this.setState(state => ({
            data1: state.data1.map(value => getRandomNumber(0, 500)),
            data2: state.data2.map(value => getRandomNumber(0, 500))
        }))
    }

    render() {
        const { data1, data2 } = this.state;
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.refreshData}>更新</Button>
                </Card>
                <Card title='柱状图'>
                    <ReactECharts option={this.getOption(data1, data2)} />
                </Card>
            </div>
        )
    }
}
