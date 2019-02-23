import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByImdbId } from '../../actions/movieActions';
import moment from 'moment';
import { 
    MOVIE_DB_API_KEY, 
    MOVIE_DB_BASE_URL
 } from '../common/keys';

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: undefined,
            releaseDate: undefined,
            imdbId: undefined,
            runtime: undefined,
            genres: undefined,
            crew: [],
            poster_path: undefined,
            backdrop_path: undefined,
            imageBaseUrl: undefined,
            posterSizeXS: undefined,
            posterSizeS: undefined,
            posterSizeM: undefined,
            posterSizeL: undefined,
            posterSizeXL: undefined,
            posterSizeXXL: undefined,
            
            error: undefined,
            errors: {}
        };
    }
    
    componentDidMount = async () => {
        this.getMovieFromApi();
    }

    getMovieFromApi = async () => {
        const {movie} = this.props.movie;
        console.log(this.props.movie);
        console.log(this.props.imdbId);
        const api_searchMovie_call =
            await fetch(`${MOVIE_DB_BASE_URL}find/${this.props.imdbId}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`);
        const searchData = await api_searchMovie_call.json();
        console.log(searchData);
            
        if (searchData.movie_results[0]) {
            const searchResultId = searchData.movie_results[0].id;

            const api_configuration_call = 
                await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
            const configData = await api_configuration_call.json();
            console.log(configData);
            if (configData.images) {
                this.setState({
                    imageBaseUrl: configData.images.base_url,
                    posterSizeXS: configData.images.poster_sizes[0], // w94
                    posterSizeS: configData.images.poster_sizes[1], // w154
                    posterSizeM: configData.images.poster_sizes[2], // w185
                    posterSizeL: configData.images.poster_sizes[3], // w342
                    posterSizeXL: configData.images.poster_sizes[4], // w500
                    posterSizeXXL: configData.images.poster_sizes[5] // w780
                });
            } else {
                console.log('Setting state images to undefined.')
                this.setState({
                    imageBaseUrl: undefined,
                    posterSizeXS: undefined,
                    posterSizeS: undefined,
                    posterSizeM: undefined,
                    posterSizeL: undefined,
                    posterSizeXL: undefined,
                    posterSizeXXL: undefined
                });
            }

            const api_call = 
                await fetch(`${MOVIE_DB_BASE_URL}movie/${searchResultId}?api_key=${MOVIE_DB_API_KEY}`);
            const data = await api_call.json();
            
            console.log(data);
            if (this.props.imdbId && searchResultId) {
                this.setState({
                    title: data.title,
                    releaseDate: data.release_date,
                    imdbId: data.imdb_id,
                    overview: data.overview,
                    runtime: data.runtime,
                    genres: data.genres,
                    poster_path: data.poster_path,
                    backdrop_path: data.backdrop_path,
                    error: ""
                });
            } else {
                this.setState({
                    title: undefined,
                    releaseDate: undefined,
                    imdbId: undefined,
                    overview: undefined,
                    runtime: undefined,
                    genres: undefined,
                    poster_path: undefined,
                    backdrop_path: undefined,
                    error: "There was an error"
                });
            }

            const api_credits_call = 
                await fetch(`${MOVIE_DB_BASE_URL}movie/${searchResultId}/credits?api_key=${MOVIE_DB_API_KEY}`);
            const credits = await api_credits_call.json();
            const cast = credits.cast;
            const crew = credits.crew;

            if (crew) {
                var directors = crew.filter(function (c) {
                    return c.job == "Director";
                });
    
                var writers = crew.filter(function (c) {
                    return c.job == "Writer" ||
                        c.job == "Story" ||
                        c.job == "Screenplay";
                });
    
                var crewForDisplay = directors;
                crewForDisplay.push.apply(directors, writers);
                
                if (crewForDisplay.length > 0) {
                    this.setState({
                        crew: crewForDisplay
                    });
                } else {
                    this.setState({
                        crew: []
                    });
                }
            }            
        }
    };

    render() {
        const {movie} = this.props.movie;

        // format year
        const formattedYear = (moment(this.state.releaseDate).format('YYYY'));

        // format genres
         var genres = "";
         if (this.state.genres && this.state.genres.length > 0) {
             var genreArray = this.state.genres;
             genreArray.forEach((genre) => {
                 genres = genres + genre.name + ', '
             });
             genres = genres.slice(0, -2);
         }

        return(
            <div className='movieDetail'>
                <Row>
                    <Col xs="4">
                            <img src={this.state.imageBaseUrl + this.state.posterSizeL + this.state.poster_path} style={{width: 185}} alt={movie.title}></img>

                        </Col>
                    <Col xs="8">
                        <h3>{this.state.title} ({formattedYear})</h3>
                        <p>{this.state.overview}</p>
                        <p>Runtime: {this.state.runtime} minutes</p>
                        <p>Genres: {genres}</p>
                        <p>Select Crew:</p>
                        <ListGroup>
                            {this.state.crew.map(({ credit_id, name, job }) => (
                                <ListGroupItem key={credit_id}>{name}: {job}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

MovieDetail.propTypes = {
    getMovieByImdbId: PropTypes.func.isRequired, 
    imdbId: PropTypes.string,
    movie: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    movie: state.movie
})

export default connect(mapStateToProps, { getMovieByImdbId })(MovieDetail);