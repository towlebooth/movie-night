import { 
    GET_MOVIES, 
    GET_MOVIES_BY_GENRE,
    GET_MOVIES_BY_PERSON,
    GET_MOVIE, 
    GET_MOVIE_DETAILS_API,
    GET_MOVIE_CHOICES_API,
    GET_MOVIE_WITH_TMDBID_API,
    MOVIE_SEARCH_BY_TITLE,
    ADD_MOVIE, 
    DELETE_MOVIE, 
    MOVIES_LOADING 
} from '../actions/types';

const initialState = {
    movies: [],
    movie: {},
    movieDetail: {},
    movieSearchResults: {},
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_MOVIES:
            return {
                ...state,
                movies: action.payload,
                loading: false
            }
        case GET_MOVIES_BY_GENRE:
                return {
                    ...state,
                    movies: action.payload,
                    loading: false
            }
        case GET_MOVIES_BY_PERSON:
                return {
                    ...state,
                    personMovies: action.payload,
                    loading: false
            }
        case GET_MOVIE:
            return {
                ...state,
                movie: action.payload,
                loading: false
            }
        case GET_MOVIE_DETAILS_API:
            return {
                ...state,
                movieDetail: action.payload,
                loading: false
            }
        case GET_MOVIE_CHOICES_API:
            return {
                ...state,
                movieChoices: action.payload,
                loading: false
            }
        case GET_MOVIE_WITH_TMDBID_API:
            return {
                ...state,
                movieDetailTmdb: action.payload,
                loading: false
            }
        case MOVIE_SEARCH_BY_TITLE:
            return {
                ...state,
                movieSearchResults: action.payload,
                loading: false
            }
        case DELETE_MOVIE:
            return {
                ...state,
                movies: state.movies.filter(movie => movie._id !== action.payload)
            }
        case ADD_MOVIE:
            return {
                ...state,
                movies: [action.payload, ...state.movies]
            }
        case MOVIES_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}