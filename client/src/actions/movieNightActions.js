import axios from 'axios';
import { 
    GET_MOVIENIGHTS, 
    GET_MOVIENIGHT, 
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

// Get movie nights by date
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
            payload: err.response.data
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