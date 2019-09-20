import { 
    GET_MOVIENIGHTS,
    GET_MOVIENIGHTS_BY_HOST,
    GET_MOVIENIGHT,
    GET_MOVIENIGHT_BY_MOVIE_VIEWED, 
    ADD_MOVIENIGHT, 
    DELETE_MOVIENIGHT, 
    MOVIENIGHTS_LOADING 
} from '../actions/types';

const initialState = {
    movieNights: [],
    movieNight: {},
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_MOVIENIGHTS:
            return {
                ...state,
                movieNights: action.payload,
                loading: false
            }
        case GET_MOVIENIGHTS_BY_HOST:
            return {
                ...state,
                movieNights: action.payload,
                loading: false
            }
        case GET_MOVIENIGHT:
            return {
                ...state,
                movieNight: action.payload,
                loading: false
            }
        case GET_MOVIENIGHT_BY_MOVIE_VIEWED:
            return {
                ...state,
                movieNightViewed: action.payload,
                loading: false
            }
        case DELETE_MOVIENIGHT:
            return {
                ...state,
                movieNights: state.movieNights.filter(movieNight => movieNight._id !== action.payload)
            }
        case ADD_MOVIENIGHT:
            return {
                ...state,
                movieNights: [action.payload, ...state.movieNights]
            }
        case MOVIENIGHTS_LOADING:
            return {
                ...initialState, // clear our stored data when before we load new data
                loading: true
            }
        default:
            return state;
    }
}