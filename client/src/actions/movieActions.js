import axios from 'axios';
import { 
    GET_MOVIES, 
    GET_MOVIES_BY_GENRE,
    GET_MOVIE,
    GET_MOVIE_DETAILS_API,
    GET_MOVIE_CHOICES_API,
    GET_MOVIE_WITH_TMDBID_API,
    MOVIE_SEARCH_BY_TITLE,
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

export const getMovieFromApiByTmdbId = (tmdbId) => dispatch => {
  dispatch(setMoviesLoading());
  getMovieDetailsFromApiWithTmdbId(tmdbId)
      .then(res =>            
          dispatch({
              type: GET_MOVIE_WITH_TMDBID_API,
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

// get movie from api with IMDB ID
const getMovieFromApi = async (imdbId) => {
    // movie by imdbId
    const api_searchMovie_call =
        await fetch(`${MOVIE_DB_BASE_URL}find/${imdbId}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`);
    const searchData = await api_searchMovie_call.json();
        
    if (searchData.movie_results[0] && searchData.movie_results[0].id) {
        const searchResultTMDB_Id = searchData.movie_results[0].id;
        const movieDetail = await getMovieDetailsFromApiWithTmdbId(searchResultTMDB_Id);
        
        return movieDetail;
    }
}

// get movie from api with TMDB ID
const getMovieDetailsFromApiWithTmdbId = async (tmdbId) => {
    var movieDetail = {};
    const api_call = 
        await fetch(`${MOVIE_DB_BASE_URL}movie/${tmdbId}?api_key=${MOVIE_DB_API_KEY}&append_to_response=credits`);
    const data = await api_call.json();
    movieDetail = data;

    if (tmdbId) {
        movieDetail.imdbId = data.imdb_id;
        movieDetail.tmdbId = tmdbId;        
    }

    if (movieDetail.imdbId) {
        // movie night for this movie  TODO: can we call movieNightActions for this?
        const movieNight = await getMovieNightForImdbId(movieDetail.imdbId);
        
        if (movieNight) {
            movieDetail.movieNightViewed = movieNight;
        }
    }

    // credits - cast and crew
    let cast = movieDetail.credits.cast;
    const crew = movieDetail.credits.crew;

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
        //movieDetail.cast = cast.slice(0,10); // return top 10 cast
        movieDetail.cast = cast;
    }

    const api_omdb_call =
        await fetch(`${OMDB_BASE_URL}apikey=${OMDB_API_KEY}&i=${data.imdb_id}`);
    const omdbData = await api_omdb_call.json();

    if (data.imdb_id && omdbData) {
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
    
    return movieDetail;
}

export const getMovieChoicesFromApi = (imdbId) => dispatch => {
    dispatch(setMoviesLoading());
    getMoviesFromApi(imdbId)
        .then(res =>            
            dispatch({
                type: GET_MOVIE_CHOICES_API,
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

// get array of movies from api for given array of IMDB IDs
const getMoviesFromApi = async (imdbIds) => {
    const results = [];
    for (const imdbId of imdbIds) {
      // asynchronous
      results.push(getMovieFromApi(imdbId));
    }
    // wait until all asynchronous calls are complete
    return await Promise.all(results);
}

const getMovieNightForImdbId = async (imdbId) => {
    let res = await axios
        .get(`/api/movieNights/movieViewed/${imdbId}`)
        .catch();
    return await res.data;
};

export const searchForMovieByTitle = (title) => dispatch => {
  dispatch(setMoviesLoading());
  
  searchForMovieByTitleFromApi(title)
      .then(res =>            
          dispatch({
              type: MOVIE_SEARCH_BY_TITLE,
              payload: res
          })            
      )
      .catch(err =>
          dispatch({
              type: GET_ERRORS,
              payload: err.response
          })
      );
}

const searchForMovieByTitleFromApi = async (title) => {
    var searchResults = [];

    const api_searchMovie_call =
        await fetch(`${MOVIE_DB_BASE_URL}search/movie?api_key=${MOVIE_DB_API_KEY}&language=en-US&query=${title}&page=1&include_adult=false`);
    const searchData = await api_searchMovie_call.json();

    if (searchData.results) 
    {
        searchResults = searchData.results;

        // limit search results to 5
        searchResults = searchResults.slice(0,5);

        // get imdbId for each search result
        for (const movie of searchResults) {
            var imdbId = await getImdbIdFromApi(movie.id);
            movie.imdb_id = imdbId;
        }

        for (const movieResult of searchResults) {
            if (movieResult.imdb_id) {
                // movie night for this movie  TODO: can we call movieNightActions for this?
                const movieNight = await getMovieNightForImdbId(movieResult.imdb_id);
                
                if (movieNight) {
                    movieResult.movieNightViewed = movieNight.date;
                }
            }
        };
    }
    
    // configuration - images, etc
    const configData = await getMovieConfigDataFromApi();
    if (configData.images) {
        var i;
        for (i = 0; i < searchResults.length; i++) { 
            searchResults[i].imageBaseUrl = configData.images.base_url;
            searchResults[i].posterSizeXS = configData.images.poster_sizes[0];
            searchResults[i].posterSizeS = configData.images.poster_sizes[1];
        }
    }
    
    return searchResults;
}

const getMovieConfigDataFromApi = async () => {
    const api_configuration_call = await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
    return await api_configuration_call.json();
}

export const getImdbIdFromApi = async (tmdbId) => {
    const api_call = 
        await fetch(`${MOVIE_DB_BASE_URL}movie/${tmdbId}?api_key=${MOVIE_DB_API_KEY}`);
    const data = await api_call.json();
    return await data.imdb_id;
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

// get all movies for a particular genre
export const getMoviesByGenre = genre => dispatch => {
    dispatch(setMoviesLoading());
    axios
        .get(`/api/movies/genre/${genre}`)
        .then(res => 
            dispatch({
                type: GET_MOVIES_BY_GENRE,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
              type: GET_MOVIES_BY_GENRE,
              payload: null
            })
          );
  };

// Get movie from our db by title
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

// Get movie from our db by imdbId
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
  //console.log(movieData);
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