import axios from 'axios';
import { 
    GET_PERSON_WITH_TMDBID_API,
    PERSONS_LOADING,
    GET_ERRORS
} from './types';

import { 
  MOVIE_DB_API_KEY, 
  MOVIE_DB_BASE_URL
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
    //console.log('personActions: ' + tmdbId);
    var personDetail = {};
    if (tmdbId) {
        const api_call = 
            //https://api.themoviedb.org/3/person/30020?api_key=dce8edd730194999ced0051496bc554e
            await fetch(`${MOVIE_DB_BASE_URL}person/${tmdbId}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        personDetail = data;
        //console.log('personDetail.name: ' + personDetail.name);
        //console.log('personDetail.id: ' + personDetail.id);
        if (tmdbId) {
            personDetail.imdbId = data.imdb_id;
            personDetail.tmdbId = data.id;        
        }
        console.log('personDetail.tmdbId in action: ' + personDetail.tmdbId);

         if (personDetail.tmdbId) {
            const personMovies = await getMoviesByPerson2(personDetail.tmdbId);
            //console.log(personMovies);
            if (personMovies) {
                personDetail.movies = personMovies[0];
            }
         }
    }
    return personDetail;
}

const getMoviesByPerson2 = async (personTmdbId) => {
    //console.log('personTmdbId in action2: ' + personTmdbId);
    let res = await axios
        .get(`/api/movies/person/${personTmdbId}`)
        .catch();
    return await res.data;
};

// // get all movies from our database for a particular person - cast/crew/etc.
// export const getMoviesByPerson = personTmdbId => dispatch => {
//     dispatch(setPersonsLoading());
//     axios
//         .get(`/api/movies/person/${personTmdbId}`)
//         .then(res => 
//             dispatch({
//                 type: GET_MOVIES_BY_PERSON,
//                 payload: res.data
//             })
//         )
//         .catch(err =>
//             dispatch({
//               type: GET_MOVIES_BY_PERSON,
//               payload: null
//             })
//           );
//   };

export const setPersonsLoading = () => {
    return {
        type: PERSONS_LOADING
    }
};