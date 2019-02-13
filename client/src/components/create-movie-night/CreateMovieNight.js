import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
//import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createMovieNight } from '../../actions/movieNightActions';
import { createMovieNoRedirect, getMovies } from '../../actions/movieActions';
import { 
    MOVIE_DB_API_KEY, 
    MOVIE_DB_BASE_URL
 } from '../common/keys';

class CreateMovieNight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            host: '',
            location: '',
            movieViewed: undefined,
            movieChoicesRoundOne: [],
            movieChoicesRoundTwo: [],
            movieChoicesRoundThree: [],
            movieVotesRoundOne: [],
            movieVotesRoundTwo: [],
            movieVotesRoundThree: [],
            imageBaseUrl: undefined,
            posterSizeXS: undefined,
            posterSizeS: undefined,
            searchResults: [],
            titleFirst: undefined,
            releaseDateFirst: undefined,
            imdbIdFirst: undefined,
            tmdbIdFirst: undefined,
            titleSecond: undefined,
            releaseDateSecond: undefined,
            imdbIdSecond: undefined,
            tmdbIdSecond: undefined,
            titleThird: undefined,
            releaseDateThird: undefined,
            imdbIdThird: undefined,
            tmdbIdThird: undefined,
            errors: {}
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {  
        this.props.getMovies();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }    
    }

    getMovieFromApi = async (e) => {
        e.preventDefault();
        const titleForSearch = e.target.elements.titleForSearch.value;

        const api_searchMovie_call =
            await fetch(`${MOVIE_DB_BASE_URL}search/movie?api_key=${MOVIE_DB_API_KEY}&language=en-US&query=${titleForSearch}&page=1&include_adult=false`);
            const searchData = await api_searchMovie_call.json();
            console.log(searchData);
            console.log(searchData.results[0])
            const searchResultId = searchData.results[0].id;
            this.setState({searchResults: searchData.results});

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

    onSelectClick = async (id) => {
        const api_call = 
        await fetch(`${MOVIE_DB_BASE_URL}movie/${id}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        console.log(data);

        this.setState({
                titleFirst: data.title,
                releaseDateFirst: data.release_date,
                imdbIdFirst: data.imdb_id,
                tmdbIdFirst: data.id.toString(),
                searchResults: [],
                error: ""
            });
    }

    onSelectClick2 = async (id) => {
        const api_call = 
        await fetch(`${MOVIE_DB_BASE_URL}movie/${id}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        console.log(data);

        this.setState({
                titleSecond: data.title,
                releaseDateSecond: data.release_date,
                imdbIdSecond: data.imdb_id,
                tmdbIdSecond: data.id.toString(),
                searchResults: [],
                error: ""
            });
    }

    onSelectClick3 = async (id) => {
        const api_call = 
        await fetch(`${MOVIE_DB_BASE_URL}movie/${id}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        console.log(data);

        this.setState({
                titleThird: data.title,
                releaseDateThird: data.release_date,
                imdbIdThird: data.imdb_id,
                tmdbIdThird: data.id.toString(),
                searchResults: [],
                error: ""
            });
    }

    onSubmit(e) {
        e.preventDefault();

        // get all movies
        //this.props.getMovies();
        const { movies } = this.props.movie;
        console.log(movies);

        //[{ type: Schema.Types.ObjectId, ref: 'movie' }]
        const movieChoicesRoundOne = [];
        let firstSelectionInDB = false;
        let secondSelectionInDB = false;
        let thirdSelectionInDB = false;

        // check to see if selected movies exist in db
        //movies.foreach((movie) => {
        let i;
        for (i = 0; i < movies.length; i++) {
            if (movies[i].imdbId === this.state.imdbIdFirst) {
                firstSelectionInDB = true;
                movieChoicesRoundOne.add(movies[i]._id);
            }
        };

            // if (movie.imdbId === this.state.imdbIdSecond) {
            //     secondSelectionInDB = true;
            //     movieChoicesRoundOne.add(movie._id);
            // }

            // if (movie.imdbId === this.state.imdbIdThird) {
            //     thirdSelectionInDB = true;
            //     movieChoicesRoundOne.add(movie._id);
            // }
        

        if (!firstSelectionInDB) {
            // save first movie to database
            const movieData = {
                title: this.state.titleFirst,
                releaseDate: this.state.releaseDateFirst,
                imdbId: this.state.imdbIdFirst,
                tmdbId: this.state.tmdbIdFirst
            };
            this.props.createMovieNoRedirect(movieData);
        }

        // TODO: not getting movies?  Does it need to be async / await or is it another issue?
        this.props.getMovies();
        const { refreshedMovies } = this.props.movie;
        for (i = 0; i < refreshedMovies.length; i++) {
            if (refreshedMovies[i].imdbId === this.state.imdbIdFirst) {
                firstSelectionInDB = true;
                console.log('adding movie to movie night')
                console.log(refreshedMovies[i])
                movieChoicesRoundOne.add(refreshedMovies[i]._id);
            }
        };



        // save those that don't already exist in db



        // save movie night
        const movieNightData = {
            date: this.state.date,
            host: this.state.host,
            location: this.state.location,
            movieViewed: this.state.movieViewed,
            movieChoicesRoundOne: this.state.movieChoicesRoundOne,
            movieChoicesRoundTwo: this.state.movieChoicesRoundTwo,
            movieChoicesRoundThree: this.state.movieChoicesRoundThree,
            movieVotesRoundOne: this.state.movieVotesRoundOne,
            movieVotesRoundTwo: this.state.movieVotesRoundTwo,
            movieVotesRoundThree: this.state.movieVotesRoundThree
        };

        console.log(movieNightData);

        //this.props.createMovieNight(movieNightData, this.props.history);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

  render() {
    const { errors } = this.state;

    // Select options for host name
    const hostOptions = [
        { label: '* Select Host', value: 0 },
        { label: 'Jackson', value: 'Jackson' },
        { label: 'Angie', value: 'Angie' },
        { label: 'Eric', value: 'Eric' },
        { label: 'Jill', value: 'Jill' },
        { label: 'Caroline', value: 'Caroline' },
        { label: 'Rick', value: 'Rick' },
        { label: 'Cathy', value: 'Cathy' },
        { label: 'Chad', value: 'Chad' },
        { label: 'Stacey', value: 'Stacey' },
        { label: 'Zach', value: 'Zach' },
        { label: 'Laura', value: 'Laura' },
        { label: 'Jennifer', value: 'Jennifer' }
    ];

    // Select options for location
    const locationOptions = [
        { label: '* Select Location', value: 0 },
        { label: 'Woodbury', value: 'Woodbury' },
        { label: 'Saint Paul', value: 'Saint Paul' },
        { label: 'New Brighton', value: 'New Brighton' },
        { label: 'Plymouth', value: 'Plymouth' },
        { label: 'Minneapolis', value: 'Minneapolis' },
        { label: 'Oakdale', value: 'Oakdale' },
        { label: 'Eden Prairie', value: 'Eden Prairie' },
        { label: 'Inver Grove Heights', value: 'Inver Grove Heights' }
    ];

    return (
        <div className="create-movie-night">
            <div className="container">                

                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Create Your Movie Night</h1>
                        <p className="lead text-center">
                            Let's get some information to make your movie night stand out
                        </p>
                        <small className="d-block pb-3">* = required fields</small>
                        <form onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                name="date"
                                placeholder="Date"
                                type="date"
                                value={this.state.date}
                                onChange={this.onChange}
                                error={errors.date}
                                info="Date of movie night"
                            />
                            <SelectListGroup
                                placeholder="Host"
                                name="host"
                                value={this.state.host}
                                onChange={this.onChange}
                                options={hostOptions}
                                error={errors.host}
                                info=""
                            />
                            <SelectListGroup
                                placeholder="Location"
                                name="location"
                                value={this.state.location}
                                onChange={this.onChange}
                                options={locationOptions}
                                error={errors.location}
                                info=""
                            />
                            <h6>Choice 1</h6>
                            <p>{this.state.titleFirst} ({moment(this.state.releaseDateFirst).format('YYYY')})</p>
                            <h6>Choice 2</h6>
                            <p>{this.state.titleSecond} ({moment(this.state.releaseDateSecond).format('YYYY')})</p>
                            <h6>Choice 3</h6>
                            <p>{this.state.titleThird} ({moment(this.state.releaseDateThird).format('YYYY')})</p>

                            
                            <input
                            type="submit"
                            value="Submit"
                            className="btn btn-info btn-block mt-4"
                            />
                        </form>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Search For Movie</h1>
                        <form onSubmit={this.getMovieFromApi}>
                            <TextFieldGroup
                                placeholder="* Movie Title"
                                name="titleForSearch"
                                value={this.state.titleForSearch}
                                onChange={this.onChange}
                                error={errors.titleForSearch}
                            />
                            
                            <input
                                type="submit"
                                value="Search"
                                className="btn btn-info btn-block mt-4"
                            />
                        </form>
                    </div>
                </div>

                <div className="row">
                    <Container>
                        <ListGroup>
                            {this.state.searchResults.map(({ id, title, release_date, overview, poster_path }) => (
                                <ListGroupItem key={id}>
                                <Row>
                                    <Col xs="4">
                                        <img src={this.state.imageBaseUrl + this.state.posterSizeXS + poster_path} style={{width: 120}} alt={title}></img>
                                    </Col>
                                    <Col xs="8">
                                        <Button 
                                            className="select-btn"
                                            color="secondary"
                                            size="sm"
                                            onClick={this.onSelectClick.bind(this, id)}
                                            >Select
                                        </Button>
                                        <Button 
                                            className="select-btn2"
                                            color="secondary"
                                            size="sm"
                                            onClick={this.onSelectClick2.bind(this, id)}
                                            >Select
                                        </Button>
                                        <Button 
                                            className="select-btn3"
                                            color="secondary"
                                            size="sm"
                                            onClick={this.onSelectClick3.bind(this, id)}
                                            >Select
                                        </Button>
                                        &nbsp;<Link to={`/movie/${title}`}>{title}</Link> ({moment(release_date).format('YYYY')}) {overview}
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Container>
                </div>


            </div>
        </div>
    );
  }
}

CreateMovieNight.propTypes = {
  movieNight: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  movie: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  movieNight: state.movieNight,
  movie: state.movie,
  errors: state.errors
});

export default connect(mapStateToProps, { createMovieNight, createMovieNoRedirect, getMovies })(
  withRouter(CreateMovieNight)
);
