import uuid from 'uuid';
import { GET_MOVIES, ADD_MOVIE, DELETE_MOVIE } from '../actions/types';

const initialState = {
    movies: [
        { id: uuid(), title: 'Casablanca'},
        { id: uuid(), title: 'Citizen Kane'},
        { id: uuid(), title: 'The Godfather'},
        { id: uuid(), title: 'The Big Lebowski'},
    ]
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_MOVIES:
            return {
                ...state
            };
        case DELETE_MOVIE:
            return {
                ...state,
                movies: state.movies.filter(movie => movie.id !== action.payload)
            }
        case ADD_MOVIE:
            return {
                ...state,
                movies: [action.payload, ...state.movies]
            }
        default:
            return state;
    }
}