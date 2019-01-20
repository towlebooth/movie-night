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
            }
        default:
            return state;
    }
}