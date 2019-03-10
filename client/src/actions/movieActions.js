import axios from 'axios';
import { 
    GET_MOVIES, 
    GET_MOVIE,
    GET_MOVIE_DETAILS_API,
    DELETE_MOVIE, 
    MOVIES_LOADING,
    GET_ERRORS
} from './types';

import { 
  MOVIE_DB_API_KEY, 
  MOVIE_DB_BASE_URL,
  OMDB_BASE_URL,
  OMDB_API_KEY
} from '../components/common/keys';

export const getMovieDetailsFromApi = (imdbId) => dispatch => {
    dispatch(setMoviesLoading());
    
    getMovieFromApi(imdbId)
        .then(res =>            
            dispatch({
                type: GET_MOVIE_DETAILS_API,
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

const getMovieFromApi = async (imdbId) => {
    var movieDetail = {};

    // movie by imdbId
    const api_searchMovie_call =
        await fetch(`${MOVIE_DB_BASE_URL}find/${imdbId}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`);
    const searchData = await api_searchMovie_call.json();
        
    if (searchData.movie_results[0]) {
        const searchResultId = searchData.movie_results[0].id;    

        // movie details
        const api_call = 
            await fetch(`${MOVIE_DB_BASE_URL}movie/${searchResultId}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        movieDetail = data;
        
        if (imdbId && searchResultId) {
            movieDetail = data;
            movieDetail.imdbId = data.imdb_id;          
        }

        // credits - cast and crew
        const api_credits_call = 
            await fetch(`${MOVIE_DB_BASE_URL}movie/${searchResultId}/credits?api_key=${MOVIE_DB_API_KEY}`);
        const credits = await api_credits_call.json();
        let cast = credits.cast;
        const crew = credits.crew;

        if (crew) {
            var directors = crew.filter(function (c) {
                return c.job === "Director";
            });

            var writers = crew.filter(function (c) {
                return c.job === "Writer" ||
                    c.job === "Story" ||
                    c.job === "Screenplay";
            });

            var crewForDisplay = directors;
            crewForDisplay.push.apply(directors, writers);
            
            if (crewForDisplay.length > 0) {
                movieDetail.crew = crewForDisplay;
            }
        } 
        
        if (cast && cast.length > 0) {
            movieDetail.cast = cast.slice(0,10); // return top 10 cast
        }

        const api_omdb_call =
            await fetch(`${OMDB_BASE_URL}apikey=${OMDB_API_KEY}&i=${imdbId}`);
        const omdbData = await api_omdb_call.json();

        if (imdbId && omdbData) {
            movieDetail.rated = omdbData.Rated;
            movieDetail.ratings = omdbData.Ratings;
        }

        // configuration - images, etc
        const configData = await getMovieConfigDataFromApi();
        
        if (configData.images) {
            movieDetail.imageBaseUrl = configData.images.base_url;
            movieDetail.posterSizeXS = configData.images.poster_sizes[0]; // w94
            movieDetail.posterSizeS = configData.images.poster_sizes[1]; // w154
            movieDetail.posterSizeM = configData.images.poster_sizes[2]; // w185
            movieDetail.posterSizeL = configData.images.poster_sizes[3]; // w342
            movieDetail.posterSizeXL = configData.images.poster_sizes[4]; // w500
            movieDetail.posterSizeXXL = configData.images.poster_sizes[5]; // w780
        }
    }
    
    return movieDetail;
}

const getMovieConfigDataFromApi = async () => {
    const api_configuration_call = await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
    return await api_configuration_call.json();
}

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

  // Get movie by imdbId
export const getMovieByImdbId = imdbId => dispatch => {
  dispatch(setMoviesLoading());
  axios
    .get(`/api/movies/imdbId/${imdbId}`)
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

// save movie without redirecting to dashboard
export const createMovieNoRedirect = (movieData) => dispatch => {
  console.log(movieData);
    axios
        .post('/api/movies', movieData)
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