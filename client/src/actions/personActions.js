import axios from 'axios';
import { 
    GET_PERSON_WITH_TMDBID_API, 
    PERSONS_LOADING,
    GET_ERRORS
} from './types';

import { 
  MOVIE_DB_API_KEY, 
  MOVIE_DB_BASE_URL,
  OMDB_BASE_URL,
  OMDB_API_KEY
} from '../components/common/keys';


export const getPersonFromApiByTmdbId = (tmdbId) => dispatch => {
    dispatch(setPersonsLoading());
    getPersonDetailsFromApiWithTmdbId(tmdbId)
        .then(res =>            
            dispatch({
                type: GET_PERSON_WITH_TMDBID_API,
                payload: res
            })            
        )
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
  }

// get person from api with TMDB ID
const getPersonDetailsFromApiWithTmdbId = async (tmdbId) => {
    var personDetail = {};
    const api_call = 
        //https://api.themoviedb.org/3/person/30020?api_key=dce8edd730194999ced0051496bc554e
        await fetch(`${MOVIE_DB_BASE_URL}person/${tmdbId}?api_key=${MOVIE_DB_API_KEY}`);
    const data = await api_call.json();
    personDetail = data;

    if (tmdbId) {
        personDetail.imdbId = data.imdb_id;
        personDetail.tmdbId = tmdbId;        
    }

    if (personDetail.imdbId) {
        // movie night for this movie  TODO: can we call movieNightActions for this?
        const movieNight = await getMovieNightForImdbId(personDetail.imdbId);
        
        if (movieNight) {
            personDetail.movieNightViewed = movieNight;
        }
    }
}

export const setPersonsLoading = () => {
    return {
        type: PERSONS_LOADING
    }
};