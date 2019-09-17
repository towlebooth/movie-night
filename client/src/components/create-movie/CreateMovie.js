import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
//import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { createMovie } from '../../actions/movieActions';
import { 
    MOVIE_DB_API_KEY, 
    MOVIE_DB_BASE_URL,
    OMDB_BASE_URL,
    OMDB_API_KEY
 } from '../common/keys';

class CreateMovie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            releaseDate: '',
            imdbId: '',
            tmdbId: undefined,
            searchResults: [],
            imageBaseUrl: undefined,
            posterSizeXS: undefined,
            posterSizeS: undefined,
            errors: {}
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
        const movieId = data.id;
        console.log(data);

        const imdbId = data.imdb_id;

        const api_credits_call =
            await fetch(`${MOVIE_DB_BASE_URL}movie/${movieId}/credits?api_key=${MOVIE_DB_API_KEY}`);
            const creditsData = await api_credits_call.json();
            console.log(creditsData);

        const api_omdb_call =
            await fetch(`${OMDB_BASE_URL}apikey=${OMDB_API_KEY}&i=${imdbId}`);
            const omdbData = await api_omdb_call.json();
            console.log(omdbData);

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
                title: data.title,
                releaseDate: data.release_date,
                imdbId: data.imdb_id,
                tmdbId: data.id.toString(),
                searchResults: [],
                error: ""
            });
    }

    onSubmit(e) {
        e.preventDefault();

        const movieData = {
            title: this.state.title,
            releaseDate: this.state.releaseDate,
            imdbId: this.state.imdbId,
            tmdbId: this.state.tmdbId
            // TODO: add new fields: cast, crew, genres

            // writers: this.state.writers,
            // directors: this.state.directors,
            // actors: this.state.actors,
            // genres: this.state.genres,
            // runTime: this.state.runTime,
            // posterUrl: this.state.posterUrl,
            // rottenTomatoesUrlKey: this.state.rottenTomatoesUrlKey,
            // rottenTomatoesTomatoMeter: this.state.rottenTomatoesTomatoMeter,
            // rottenTomatoesAudienceScore: this.state.rottenTomatoesAudienceScore,
            // imdbId: this.state.imdbId,
            // imdbRating: this.state.imdbRating
        };

        this.props.createMovie(movieData, this.props.history);
    }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
        <div className="create-movie">
            <div className="container">                
                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Search For Movie</h1>
                        <p className="lead text-center">
                            Is this movie in omdb?
                        </p>
                        <small className="d-block pb-3">* = required fields</small>
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
                                        &nbsp;<Link to={`/movie/${title}`}>{title}</Link> ({moment(release_date).format('YYYY')}) {overview}
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Container>
                </div>

                <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Create Your Movie</h1>
                        <p className="lead text-center">
                            Let's get some information to make your movie stand out
                        </p>
                        <small className="d-block pb-3">* = required fields</small>
                        <form onSubmit={this.onSubmit}>
                            <TextFieldGroup
                            placeholder="* Movie Title"
                            name="title"
                            value={this.state.title}
                            onChange={this.onChange}
                            error={errors.title}
                            />
                            <TextFieldGroup
                            name="releaseDate"
                            placeholder="Date movie was released"
                            type="date"
                            value={this.state.releaseDate}
                            onChange={this.onChange}
                            error={errors.releaseDate}
                            info="Release date of movie"
                            />
                            <TextFieldGroup
                            placeholder="IMDB ID"
                            name="imdbId"
                            value={this.state.imdbId}
                            onChange={this.onChange}
                            error={errors.imdbId}
                            info="The last piece of the url to a movie on IMDB (eg. tt0087332 from url https://www.imdb.com/title/tt0087332/"
                            />
                            <TextFieldGroup
                            placeholder="TMDB ID"
                            name="tmdbId"
                            type="text"
                            value={this.state.tmdbId}
                            onChange={this.onChange}
                            error={errors.tmdbId}
                            info=""
                            />
                            {/* <TextFieldGroup
                            placeholder="Writers"
                            name="writers"
                            value={this.state.writers}
                            onChange={this.onChange}
                            error={errors.writers}
                            info="List of writer names seperated by commas (eg. Phil Lord, Christopher Miller)"
                            />
                            <TextFieldGroup
                            placeholder="Directors"
                            name="directors"
                            value={this.state.directors}
                            onChange={this.onChange}
                            error={errors.directors}
                            info="List of director names seperated by commas (eg. Joel Coen, Ethan Coen)"
                            />
                            <TextFieldGroup
                            placeholder="Actors"
                            name="actors"
                            value={this.state.actors}
                            onChange={this.onChange}
                            error={errors.actors}
                            info="List of actor names seperated by commas (eg. Bill Murray, Dan Aykroyd, Sigourney Weaver)"
                            />
                            <TextFieldGroup
                            placeholder="Genres"
                            name="genres"
                            value={this.state.genres}
                            onChange={this.onChange}
                            error={errors.genres}
                            info="List of genre names seperated by commas (eg. Action, Suspense, Drama)"
                            />
                            <TextFieldGroup
                            placeholder="Runtime"
                            name="runTime"
                            value={this.state.runTime}
                            onChange={this.onChange}
                            error={errors.runTime}
                            info="Runtime of movie in minutes"
                            />
                            <TextFieldGroup
                            placeholder="Poster URL"
                            name="posterUrl"
                            value={this.state.posterUrl}
                            onChange={this.onChange}
                            error={errors.posterUrl}
                            info="URL of movie poster (eg. https://m.media-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_SX300.jpg"
                            />
                            <TextFieldGroup
                            placeholder="Rotten Tomatoes Url Key"
                            name="rottenTomatoesUrlKey"
                            value={this.state.rottenTomatoesUrlKey}
                            onChange={this.onChange}
                            error={errors.rottenTomatoesUrlKey}
                            info="The last piece of the url to a movie on Rotten Tomatoes (eg. the_big_lebowski from url https://www.rottentomatoes.com/m/the_big_lebowski"
                            />
                            <TextFieldGroup
                            placeholder="TomatoMeter"
                            name="rottenTomatoesTomatoMeter"
                            value={this.state.rottenTomatoesTomatoMeter}
                            onChange={this.onChange}
                            error={errors.rottenTomatoesTomatoMeter}
                            info="TomatoMeter from Rotten Tomatoes (1-100)"
                            />
                            <TextFieldGroup
                            placeholder="Rotten Tomatoes Audience Score"
                            name="rottenTomatoesAudienceScore"
                            value={this.state.rottenTomatoesAudienceScore}
                            onChange={this.onChange}
                            error={errors.rottenTomatoesAudienceScore}
                            info="Audience Score from Rotten Tomatoes (1-100)"
                            />
                            <TextFieldGroup
                            placeholder="IMDB ID"
                            name="imdbId"
                            value={this.state.imdbId}
                            onChange={this.onChange}
                            error={errors.imdbId}
                            info="The last piece of the url to a movie on IMDB (eg. tt0087332 from url https://www.imdb.com/title/tt0087332/"
                            />
                            <TextFieldGroup
                            placeholder="IMDB Rating"
                            name="imdbRating"
                            value={this.state.imdbRating}
                            onChange={this.onChange}
                            error={errors.imdbRating}
                            info="Rating out of 10 on IMDB (eg. 7.8)"
                            /> */}
                            
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

CreateMovie.propTypes = {
  movie: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  omdb: PropTypes.object
};

const mapStateToProps = state => ({
  movie: state.movie,
  errors: state.errors,
  omdb: state.omdb
});

export default connect(mapStateToProps, { createMovie })(
  withRouter(CreateMovie)
);
