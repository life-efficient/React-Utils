import { combineReducers, createStore } from 'redux';
import muiModal from './reducers/muiModal';
import app from "./reducers/app"

const reducer = combineReducers({
    app,
    muiModal,
})

const store = createStore(reducer);
export default store;