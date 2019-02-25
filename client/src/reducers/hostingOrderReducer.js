import { GET_HOSTINGORDERS, HOSTINGORDERS_LOADING } from '../actions/types';

const initialState = {
    hostingOrders: [],
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_HOSTINGORDERS:
            return {
                ...state,
                hostingOrders: action.payload,
                loading: false
            }
            case HOSTINGORDERS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}