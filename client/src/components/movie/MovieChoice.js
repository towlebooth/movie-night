import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByImdbId } from '../../actions/movieActions';
import moment from 'moment';
import { 
    MOVIE_DB_API_KEY, 
    MOVIE_DB_BASE_URL
 } from '../common/keys';

class MovieChoice extends Component {
    componentDidMount = async () => {
        this.getMovieFromApi();
    }

    getMovieFromApi = async () => {

        const api_searchMovie_call =
            await fetch(`${MOVIE_DB_BASE_URL}find/${this.props.imdbId}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`);
            const searchData = await api_searchMovie_call.json();
            console.log(searchData);
            
        if (searchData.movie_results[0]) {
            const searchResultId = searchData.movie_results[0].id;
            //this.setState({searchResults: searchData.results});

            const api_configuration_call = 
                await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
            const configData = await api_configuration_call.json();
            console.log(configData);
            if (configData.images) {
                this.setState({
                    imageBaseUrl: configData.images.base_url,
                    posterSizeXS: configData.images.poster_sizes[0],
                    posterSizeS: configData.images.poster_sizes[1]
                });
            } else {
                this.setState({
                    imageBaseUrl: undefined,
                    posterSizeXS: undefined,
                    posterSizeS: undefined
                });
            }

            const api_call = 
                await fetch(`${MOVIE_DB_BASE_URL}movie/${searchResultId}?api_key=${MOVIE_DB_API_KEY}`);
            const data = await api_call.json();
            //const movieId = data.id;
            console.log(data);

        }

        //const imdbId = data.imdb_id;

        // if (titleForSearch && movieId) {
        //     this.setState({
        //         title: data.title,
        //         releaseDate: data.release_date,
        //         imdbId: data.imdb_id,
        //         tmdbId: data.id.toString(),
        //         error: ""
        //     });
        // } else {
        //     this.setState({
        //         title: undefined,
        //         releaseDate: undefined,
        //         imdbId: undefined,
        //         tmdbId: undefined,
        //         error: "There was an error"
        //     });
        // }
    };

    render() {
        const {movie} = this.props.movie;
        console.log(movie)

        // format year
        const formattedYear = (moment(movie.releaseDate).format('YYYY'));


        return(
            <div className='movieChoice'>
            <h3>{movie.title}</h3>
            <h5>{formattedYear}</h5>
        {/* <img src={props.src} className='picture'/>
        {props.children} */}
        </div>
        );
    }
}

MovieChoice.propTypes = {
    getMovieByImdbId: PropTypes.func.isRequired, 
    imdbId: PropTypes.string.isRequired,
    movie: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    movie: state.movie
})

export default connect(mapStateToProps, { getMovieByImdbId })(MovieChoice);