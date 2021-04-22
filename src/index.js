import React from 'react';
import ReactDom from 'react-dom';
import App from './App'

import { Provider } from 'react-redux'
import store from './redux/store'

// import memoryUtils from './utils/memoryUtils'
// import storageUtils from './utils/storageUtils'

// 读取local中保存的user，保存到内存里
// const user = storageUtils.getUser();
// memoryUtils.user = user;

ReactDom.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root')
);