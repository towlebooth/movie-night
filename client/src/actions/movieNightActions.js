import axios from 'axios';
import { 
    GET_MOVIENIGHTS,
    GET_MOVIENIGHTS_BY_HOST,
    GET_MOVIENIGHT,
    GET_MOVIENIGHT_BY_MOVIE_VIEWED,
    DELETE_MOVIENIGHT, 
    MOVIENIGHTS_LOADING,
    GET_ERRORS
} from './types';

// get all movie nights
export const getMovieNights = () => dispatch => {
    dispatch(setMovieNightsLoading());
    axios
        .get('/api/movieNights')
        .then(res => 
            dispatch({
                type: GET_MOVIENIGHTS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
              type: GET_MOVIENIGHTS,
              payload: null
            })
          );
};

// get all movie nights for a particular host
export const getMovieNightsByHost = host => dispatch => {
  dispatch(setMovieNightsLoading());
  axios
      .get(`/api/movieNights/host/${host}`)
      .then(res => 
          dispatch({
              type: GET_MOVIENIGHTS_BY_HOST,
              payload: res.data
          })
      )
      .catch(err =>
          dispatch({
            type: GET_MOVIENIGHTS,
            payload: null
          })
        );
};

// Get movie night by date
export const getMovieNightByDate = date => dispatch => {
    dispatch(setMovieNightsLoading());
    axios
      .get(`/api/movieNights/date/${date}`)
      .then(res =>
        dispatch({
          type: GET_MOVIENIGHT,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err
          })
        );
  };

// Get movie night by movie viewed IMDB ID
export const getMovieNightByMovieViewed = movieViewed => dispatch => {
  dispatch(setMovieNightsLoading());
  console.log(movieViewed)
  axios
    .get(`/api/movieNights/movieViewed/${movieViewed}`)
    .then(res =>
      dispatch({
        type: GET_MOVIENIGHT_BY_MOVIE_VIEWED,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
          type: GET_ERRORS,
          payload: err
        })
      );
};
 
// delete movie night by id
export const deleteMovieNight = (id) => dispatch => {
    axios.delete(`/api/movieNights/${id}`).then(res =>
        dispatch({
            type: DELETE_MOVIENIGHT,
            payload: id
        }))
}

export const createMovieNight = (movieNightData, history) => dispatch => {
    axios
        .post('/api/movieNights', movieNightData)
        .then(res => history.push('/dashboard'))
        .catch(err =>
            dispatch({
              type: GET_ERRORS,
              payload: err.response.data
            })
          );
};

export const setMovieNightsLoading = () => {
    return {
        type: MOVIENIGHTS_LOADING
    }
};