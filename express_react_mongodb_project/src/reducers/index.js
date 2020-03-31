import authentication from './authentication';
import { combineReducers } from 'redux';
import memo from './memo';
import search from './search';

export default combineReducers({
    authentication,
    memo,
    search
});