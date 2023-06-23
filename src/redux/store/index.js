import {createStore,applyMiddleware} from 'redux';
import rootReducers from '../reducer/index';
import thunk from 'redux-thunk';
const store =createStore(
    rootReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
)

export default store;
 