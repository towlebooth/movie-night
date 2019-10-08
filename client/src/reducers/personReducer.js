import { 
    GET_PERSON_WITH_TMDBID_API, 
    PERSONS_LOADING 
} from '../actions/types';

const initialState = {
    person: {},
    personDetail: {},
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_PERSON_WITH_TMDBID_API:
            return {
                ...state,
                personDetail: action.payload,
                loading: false
            }
        case PERSONS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}