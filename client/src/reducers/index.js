import { combineReducers } from 'redux';
import movieReducer from './movieReducer';
import movieNightReducer from './movieNightReducer';
import hostingOrderReducer from './hostingOrderReducer';
import userDetailReducer from './userDetailReducer';
import personReducer from './personReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import releaseNoteReducer from './releaseNoteReducer';

export default combineReducers({
    movie: movieReducer,
    movieNight: movieNightReducer,
    hostingOrder: hostingOrderReducer,
    userDetail: userDetailReducer,
    person: personReducer,
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer,
    releaseNote: releaseNoteReducer
});