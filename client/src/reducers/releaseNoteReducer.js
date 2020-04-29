import { GET_RELEASENOTES, RELEASENOTES_LOADING } from '../actions/types';

const initialState = {
    releaseNotes: [],
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_RELEASENOTES:
            return {
                ...state,
                releaseNotes: action.payload,
                loading: false
            }
            case RELEASENOTES_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}