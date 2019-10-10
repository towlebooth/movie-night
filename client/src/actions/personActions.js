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
                payload: err
            })
        );
  }

// get person from api with TMDB ID
const getPersonDetailsFromApiWithTmdbId = async (tmdbId) => {
    var personDetail = {};
    if (tmdbId) {
        const api_call = 
            await fetch(`${MOVIE_DB_BASE_URL}person/${tmdbId}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        personDetail = data;
        if (personDetail && data.imdb_id) {
            personDetail.imdbId = data.imdb_id;
            personDetail.tmdbId = data.id;        
        }

        if (personDetail.tmdbId) {
            const personMovieCreditsFromApi = await getMovieCreditsForPersonFromApi(personDetail.tmdbId);
            if (personMovieCreditsFromApi) {
                personDetail.movieCredits = personMovieCreditsFromApi;
            }

            const personMovies = await getMoviesByPerson(personDetail.tmdbId);
            if (personMovies) {
                personDetail.movies = personMovies[0];
            }
        }

        // configuration - images, etc
        const configData = await getMovieConfigDataFromApi();

        if (configData.images) {
            personDetail.imageBaseUrl = configData.images.base_url;
            personDetail.posterSizeXS = configData.images.poster_sizes[0]; // w94
            personDetail.posterSizeS = configData.images.poster_sizes[1]; // w154
            personDetail.posterSizeM = configData.images.poster_sizes[2]; // w185
            personDetail.posterSizeL = configData.images.poster_sizes[3]; // w342
            personDetail.posterSizeXL = configData.images.poster_sizes[4]; // w500
            personDetail.posterSizeXXL = configData.images.poster_sizes[5]; // w780
        }    
    }
    return personDetail;
}

// get movie credits for this person from tmdb
const getMovieCreditsForPersonFromApi = async (personTmdbId) => {
    const api_call =
        await fetch(`${MOVIE_DB_BASE_URL}person/${personTmdbId}/movie_credits?api_key=${MOVIE_DB_API_KEY}`);
        const credits = await api_call.json();
        
        if (credits.cast[0] && credits.cast[0].id) {
            // get imdbId for each cast member
            for (const castCredit of credits.cast) {
                castCredit.imdbId = await getImdbIdFromApi(castCredit.id);
            }
        }

        if (credits.crew[0] && credits.crew[0].id) {
            // get imdbId for each crew member
            for (const crewCredit of credits.crew) {
                crewCredit.imdbId = await getImdbIdFromApi(crewCredit.id);
            }
        }
    return credits;
}

// get imdbId from api for a tmdbId
const getImdbIdFromApi = async (tmdbId) => {
    //var imdbId;
    if (tmdbId) {
        const api_call = 
            await fetch(`${MOVIE_DB_BASE_URL}movie/${tmdbId}?api_key=${MOVIE_DB_API_KEY}&append_to_response=credits`);
        const movieFromApi = await api_call.json();
        console.log(movieFromApi.title + ' ' + movieFromApi.imdb_id);
        return movieFromApi.imdb_id;
    }
    return null;
}

// get movies for this person from our database
const getMoviesByPerson = async (personTmdbId) => {
    let res = await axios
        .get(`/api/movies/person/${personTmdbId}`)
        .catch();
    return await res.data;
};

const getMovieConfigDataFromApi = async () => {
    const api_configuration_call = await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
    return await api_configuration_call.json();
}

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