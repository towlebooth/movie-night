import { combineReducers } from 'redux';
import movieReducer from './movieReducer';
import movieNightReducer from './movieNightReducer';
import hostingOrderReducer from './hostingOrderReducer';
import personReducer from './personReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';

export default combineReducers({
    movie: movieReducer,
    movieNight: movieNightReducer,
    hostingOrder: hostingOrderReducer,
    person: personReducer,
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer
});