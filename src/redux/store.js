//redux最核心的管理对象store

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk' //用来执行redux异步函数
import reducer from './reducer'
import { composeWithDevTools } from 'redux-devtools-extension'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));