import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByImdbId } from '../../actions/movieActions';
import moment from 'moment';
import { 
    MOVIE_DB_API_KEY, 
    MOVIE_DB_BASE_URL,
    OMDB_BASE_URL,
    OMDB_API_KEY
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
            cast: [],
            poster_path: undefined,
            backdrop_path: undefined,
            imageBaseUrl: undefined,
            posterSizeXS: undefined,
            posterSizeS: undefined,
            posterSizeM: undefined,
            posterSizeL: undefined,
            posterSizeXL: undefined,
            posterSizeXXL: undefined,
            rated: undefined,
            ratings: [],

            error: undefined,
            errors: {}
        };
    }
    
    componentDidMount = async () => {
        this.getMovieFromApi();
    }

    componentWillReceiveProps(nextProps){
        console.log('componentWillRecieveProps')
        console.log(nextProps.value)
        if(nextProps.value !== this.props.value){
            //this.setState({count:nextProps.value});
            this.getMovieFromApi();
        }
    }

    getMovieFromApi = async () => {
        //const {movie} = this.props.movie;

        // movie by imdbId
        const api_searchMovie_call =
            await fetch(`${MOVIE_DB_BASE_URL}find/${this.props.imdbId}?api_key=${MOVIE_DB_API_KEY}&language=en-US&external_source=imdb_id`);
        const searchData = await api_searchMovie_call.json();
        //console.log(searchData);
            
        if (searchData.movie_results[0]) {
            const searchResultId = searchData.movie_results[0].id;

            // configuration - images, etc
            const api_configuration_call = 
                await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
            const configData = await api_configuration_call.json();
            //console.log(configData);
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

            // movie details
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
                    this.setState({
                        crew: crewForDisplay
                    });
                } else {
                    this.setState({
                        crew: []
                    });
                }
            } 
            
            if (cast && cast.length > 0) {
                cast = cast.slice(0,10);
                
                this.setState({
                    cast: cast
                });
            } else {
                this.setState({
                    cast: []
                });
            }

            const api_omdb_call =
                await fetch(`${OMDB_BASE_URL}apikey=${OMDB_API_KEY}&i=${this.props.imdbId}`);
            const omdbData = await api_omdb_call.json();
            //console.log(omdbData);

            if (this.props.imdbId && omdbData) {
                this.setState({
                    rated: omdbData.Rated,
                    ratings: omdbData.Ratings
                });
            } else {
                this.setState({
                    rated: undefined,
                    ratings: []
                });
            }
        }
    };

    render() {
        //const {movie} = this.props.movie;

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
                            <img src={this.state.imageBaseUrl + this.state.posterSizeL + this.state.poster_path} style={{width: 185}} alt={this.state.title}></img>

                        </Col>
                    <Col xs="8">
                        <h3>{this.state.title} ({formattedYear})</h3>
                        <p>{this.state.overview}</p>
                        <p>Runtime: {this.state.runtime} minutes</p>
                        <p>Genres: {genres}</p>
                        <p>Rated: {this.state.rated}</p>
                        <p>Ratings:</p>
                        <ListGroup>
                            {this.state.ratings.map(({ Source, Value }) => (
                                <ListGroupItem>{Source}: {Value}</ListGroupItem>
                            ))}
                        </ListGroup>
                        <p>Select Crew:</p>
                        <ListGroup>
                            {this.state.crew.map(({ credit_id, name, job }) => (
                                <ListGroupItem key={credit_id}>{name}: {job}</ListGroupItem>
                            ))}
                        </ListGroup>
                        <p>Select Cast:</p>
                        <ListGroup>
                            {this.state.cast.map(({ cast_id, name, character }) => (
                                <ListGroupItem key={cast_id}>{name}: {character}</ListGroupItem>
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