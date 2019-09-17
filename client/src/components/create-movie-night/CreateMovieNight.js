import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createMovieNight } from '../../actions/movieNightActions';
import { createMovieNoRedirect, getMovies, searchForMovieByTitle, getMovieFromApiByTmdbId } from '../../actions/movieActions';

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
        this.props.getMovies();    // TODO: is this needed?
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }    
    }

    getMovieFromApi = async (e) => {
        e.preventDefault();
        const titleForSearch = e.target.elements.titleForSearch.value;

        this.props.searchForMovieByTitle(titleForSearch);
    };

    onSelectClick = async (id, choiceNumber, imdb_id, title, release_date) => {
        switch(choiceNumber) {
            default:
                this.setState({
                    titleFirst: title,
                    releaseDateFirst: release_date,
                    imdbIdFirst: imdb_id,
                    tmdbIdFirst: id.toString(),
                    error: ""
                });
                break;
            case 2:
                this.setState({
                    titleSecond: title,
                    releaseDateSecond: release_date,
                    imdbIdSecond: imdb_id,
                    tmdbIdSecond: id.toString(),
                    error: ""
                });
                break;
            case 3:
                this.setState({
                    titleThird: title,
                    releaseDateThird: release_date,
                    imdbIdThird: imdb_id,
                    tmdbIdThird: id.toString(),
                    error: ""
                });
                break;
        }
    }

    onSubmit = async (e)  =>{
        e.preventDefault();

        // get all movies
        const { movies } = this.props.movie;
        //console.log(movies);

        const movieChoicesRoundOne = [];
        let firstSelectionInDB = false;
        let secondSelectionInDB = false;
        let thirdSelectionInDB = false;

        if (this.state.imdbIdFirst) {
            movieChoicesRoundOne.push(this.state.imdbIdFirst)
        }

        if (this.state.imdbIdSecond) {
            movieChoicesRoundOne.push(this.state.imdbIdSecond)
        }

        if (this.state.imdbIdThird) {
            movieChoicesRoundOne.push(this.state.imdbIdThird)
        }

        this.state.movieChoicesRoundOne = movieChoicesRoundOne;

        // check to see if selected movies exist in db
        let i;
        for (i = 0; i < movies.length; i++) {
            if (this.state.imdbIdFirst && movies[i].imdbId === this.state.imdbIdFirst) {
                firstSelectionInDB = true;                
            }
            if (this.state.imdbIdSecond && movies[i].imdbId === this.state.imdbIdSecond) {
                secondSelectionInDB = true;
            }
            if (this.state.imdbIdThird && movies[i].imdbId === this.state.imdbIdThird) {
                thirdSelectionInDB = true;
            }
        };
    

         if (!firstSelectionInDB && this.state.imdbIdFirst) {
            // save first movie to database
            const movieData = {
                title: this.state.titleFirst,
                releaseDate: this.state.releaseDateFirst,
                imdbId: this.state.imdbIdFirst,
                tmdbId: this.state.tmdbIdFirst
                // TODO: add genres, cast, crew
            };
            await this.saveMovie(movieData);
        }

        if (!secondSelectionInDB && this.state.imdbIdSecond) {
            // save second movie to database
            const movieData = {
                title: this.state.titleSecond,
                releaseDate: this.state.releaseDateSecond,
                imdbId: this.state.imdbIdSecond,
                tmdbId: this.state.tmdbIdSecond
                // TODO: add genres, cast, crew
            };
            await this.saveMovie(movieData);
        }

        if (!thirdSelectionInDB && this.state.imdbIdThird) {
            // save third movie to database
            const movieData = {
                title: this.state.titleThird,
                releaseDate: this.state.releaseDateThird,
                imdbId: this.state.imdbIdThird,
                tmdbId: this.state.tmdbIdThird
                // TODO: add genres, cast, crew
            };
            await this.saveMovie(movieData);
        }

        // save movie night
        const movieNightData = {
            date: this.state.date,
            host: this.state.host,
            location: this.state.location,
            // TODO: only set movieViewed here prior to launch
            //movieViewed: this.state.movieViewed,
            movieViewed: this.state.imdbIdFirst,
            movieChoicesRoundOne: this.state.movieChoicesRoundOne,
            movieChoicesRoundTwo: this.state.movieChoicesRoundTwo,
            movieChoicesRoundThree: this.state.movieChoicesRoundThree,
            movieVotesRoundOne: this.state.movieVotesRoundOne,
            movieVotesRoundTwo: this.state.movieVotesRoundTwo,
            movieVotesRoundThree: this.state.movieVotesRoundThree
        };

        //console.log(movieNightData);

        if (movieNightData.date && movieNightData.host) {
            this.props.createMovieNight(movieNightData, this.props.history);
        }
    }

    // save first movie to database
    saveMovie = async (movieData) => {        
        this.props.createMovieNoRedirect(movieData);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

  render() {
    const { errors } = this.state;
    var movieSearchResults = [];    
    let searchResultsContent; 

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
        { label: 'Theater - No Host', value: 'Theater' },
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
        { label: 'Inver Grove Heights', value: 'Inver Grove Heights' },
        { label: 'Marcus Cinema, Oakdale', value: 'Marcus Cinema, Oakdale' },
        { label: 'Alamo Drafthouse, Woodbury', value: 'Alamo Drafthouse, Woodbury' }
    ];

    if (this.props.movieSearchResults && this.props.movieSearchResults[0]) {
        movieSearchResults = this.props.movieSearchResults;

        searchResultsContent = (
            <div className="row">
                <Container>
                    <ListGroup>
                        {movieSearchResults.map(({ id, title, release_date, overview, poster_path, imageBaseUrl, posterSizeXS, imdb_id }) => (
                            <ListGroupItem key={id}>
                            <Row>
                                <Col xs="4">
                                    <img src={imageBaseUrl + posterSizeXS + poster_path} style={{width: 120}} alt={title}></img>
                                </Col>
                                <Col xs="8">
                                    <Button 
                                        className="select-btn"
                                        color="secondary"
                                        size="sm"
                                        onClick={this.onSelectClick.bind(this, id, 1, imdb_id, title, release_date)}
                                        >Make Choice 1
                                    </Button>
                                    &nbsp;
                                    <Button 
                                        className="select-btn2"
                                        color="secondary"
                                        size="sm"
                                        onClick={this.onSelectClick.bind(this, id, 2, imdb_id, title, release_date)}
                                        >Make Choice 2
                                    </Button>
                                    &nbsp;
                                    <Button 
                                        className="select-btn3"
                                        color="secondary"
                                        size="sm"
                                        onClick={this.onSelectClick.bind(this, id, 3, imdb_id, title, release_date)}
                                        >Make Choice 3
                                    </Button>
                                    <p>{title} ({moment(release_date).format('YYYY')})</p>
                                    <p>{overview}</p>
                                </Col>
                            </Row>
                        </ListGroupItem>
                        ))}
                    </ListGroup>
                </Container>
            </div>
        );

    }

    return (
        <div className="create-movie-night">
            <div className="container">                

                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h3 className="display-4 text-center">Create Your Movie Night</h3>
                        <p className="lead text-center">
                            {/* Let's get some information to make your movie night stand out */}
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
                            <div className="row">
                                &nbsp;
                            </div>
                            <div className="row">
                                <div className="col-md-8 m-auto">
                                    <h4 className="display-4 text-center">Search For Movie</h4>
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
                                &nbsp;
                            </div>

                            {searchResultsContent}


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
            </div>
        </div>
    );
  }
}

CreateMovieNight.propTypes = {
  movieNight: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  movie: PropTypes.object.isRequired,
  movieSearchResults: PropTypes.array,
  movieDetailTmdb: PropTypes.object
};

const mapStateToProps = state => ({
  movieNight: state.movieNight,
  movie: state.movie,
  movieSearchResults: state.movie.movieSearchResults,
  movieDetailTmdb: state.movie.movieDetailTmdb,
  errors: state.errors
});

export default connect(mapStateToProps, { createMovieNight, createMovieNoRedirect, getMovies, searchForMovieByTitle, getMovieFromApiByTmdbId })(
  withRouter(CreateMovieNight)
);
