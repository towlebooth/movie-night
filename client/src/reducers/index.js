import { combineReducers } from 'redux';
import movieReducer from './movieReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';

export default combineReducers({
    movie: movieReducer,
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer
});