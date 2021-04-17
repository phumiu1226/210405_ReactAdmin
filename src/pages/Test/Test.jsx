import React, { Component } from 'react';

export default class test extends Component {
    state = { count: 0 }

    //object setState , 合并为1次setState ， 1次render => 结果为 1
    button1 = () => {
        this.setState({ count: this.state.count + 1 });
        this.setState({ count: this.state.count + 1 });
    }

    //function setState , 2次setState ， 1次render => 结果为 2
    button2 = () => {

        this.setState(state => ({
            count: state.count + 1
        })
        );

        this.setState(state => ({
            count: state.count + 1
        })
        );

    }

    render() {
        return (
            <div>
                <div>{this.state.count}</div>
                <button onClick={this.button1}>button 1</button>
                <button onClick={this.button2}>button 2</button>
            </div>
        )
    }
}