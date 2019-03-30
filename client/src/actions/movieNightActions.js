import axios from 'axios';
import { 
    GET_MOVIENIGHTS, 
    GET_MOVIENIGHT, 
    DELETE_MOVIENIGHT, 
    MOVIENIGHTS_LOADING,
    GET_ERRORS
} from './types';

import { 
  MOVIE_DB_API_KEY, 
  MOVIE_DB_BASE_URL,
  OMDB_BASE_URL,
  OMDB_API_KEY
} from '../components/common/keys';

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

// Get movie night by date
export const getMovieNightByDate = date => dispatch => {
    dispatch(setMovieNightsLoading());
    axios
      .get(`/api/movieNights/date/${date}`)
    //getMovieNightDetailsByDate(date)
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

// const getMovieNightDetailsByDate = async (date) => {
//     //axios.get(`/api/movieNights/date/${date}`).then(res =>
//     let res = await axios.get(`/api/movieNights/date/${date}`);
//       // res.data.movieChoicesRoundOne.forEach(movieImdbId => {
//       //     console.log(movieImdbId);
//       // }),
//     let movieNight = res.data;
//     if (movieNight && movieNight.movieChoicesRoundOne && movieNight.movieChoicesRoundOne.len > 0)
//     {
//         movieNight.movieChoicesRoundOne.array.forEach(movieImdbId => {
//           const api_searchMovie_call =
//           await fetch(`${MOVIE_DB_BASE_URL}find/${movieImdbId}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`);
//       const searchData = await api_searchMovie_call.json();
//       console.log(searchData.movie_results[0])
//         });
//         // if (movieNight.movieChoicesRoundOne[0]) {
//         //     const api_searchMovie_call =
//         //         await fetch(`${MOVIE_DB_BASE_URL}find/${movieNight.movieChoicesRoundOne[0]}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`);
//         //     const searchData = await api_searchMovie_call.json();
//         //     console.log(searchData.movie_results[0])
//         // }
//     }
//   //);
// }
 
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