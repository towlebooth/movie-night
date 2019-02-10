import { combineReducers } from 'redux';
import movieReducer from './movieReducer';
import movieNightReducer from './movieNightReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';

export default combineReducers({
    movie: movieReducer,
    movieNight: movieNightReducer,
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer
});