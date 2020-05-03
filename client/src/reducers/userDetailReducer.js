import { GET_USER_DETAILS, USER_DETAILS_LOADING } from '../actions/types';

const initialState = {
    userDetails: [],
    loading: false
}

export default function(state = initialState, action) {
    //console.log('Made it to userDetailReducer.  Action: ' + action.type);
    switch(action.type) {
        case GET_USER_DETAILS:
            //console.log('users from reducer: ' + action.payload);
            return {
                ...state,
                userDetails: action.payload,
                loading: false
            }
            case USER_DETAILS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}