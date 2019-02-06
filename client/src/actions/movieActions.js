import axios from 'axios';
import { 
    GET_MOVIES, 
    GET_MOVIE, 
    DELETE_MOVIE, 
    MOVIES_LOADING,
    GET_ERRORS
} from './types';

export const getMovies = () => dispatch => {
    dispatch(setMoviesLoading());
    axios
        .get('/api/movies')
        .then(res => 
            dispatch({
                type: GET_MOVIES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
              type: GET_MOVIES,
              payload: null
            })
          );
};

// Get movie by title
export const getMovieByTitle = title => dispatch => {
    dispatch(setMoviesLoading());
    axios
      .get(`/api/movies/title/${title}`)
      .then(res =>
        dispatch({
          type: GET_MOVIE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
          })
        );
  };

  

export const deleteMovie = (id) => dispatch => {
    axios.delete(`/api/movies/${id}`).then(res =>
        dispatch({
            type: DELETE_MOVIE,
            payload: id
        }))
}

export const createMovie = (movieData, history) => dispatch => {
    axios
        .post('/api/movies', movieData)
        .then(res => history.push('/dashboard'))
        .catch(err =>
            dispatch({
              type: GET_ERRORS,
              payload: err.response.data
            })
          );
};

export const setMoviesLoading = () => {
    return {
        type: MOVIES_LOADING
    }
};