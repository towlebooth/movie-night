import { GET_MOVIES, ADD_MOVIE, DELETE_MOVIE } from './types';

export const getMovies = () => {
    return {
        type: GET_MOVIES
    }
}