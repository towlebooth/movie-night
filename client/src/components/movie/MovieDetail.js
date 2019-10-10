import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieDetailsFromApi, createMovieNoRedirect, createMovie } from '../../actions/movieActions';
import { getMovieNights } from '../../actions/movieNightActions';
import moment from 'moment';
import './../../App.css';

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieToUpdatetoDB: undefined
        };
    }
    
    componentDidMount = async () => {
        this.props.getMovieDetailsFromApi(this.props.imdbId);
    }

    // TODO: Remove temp
    /*
    onSubmit = async (e)  =>{
        e.preventDefault();
        //console.log(this.state.movieToUpdatetoDB);
        if (this.props.movieDetail && this.props.movieDetail.release_date) {
            var movieDetail = {};
            movieDetail = this.props.movieDetail;
            //console.log(movieDetail);
            //console.log(this.props.movie.movie);
            
            if (this.props.movie.movie && this.props.movie.movie._id) {
                var movieToUpdate = this.props.movie.movie;
                movieToUpdate.genres = movieDetail.genres;

                if (movieDetail.crew) {
                    var crewToAdd = [];
                    movieDetail.crew.forEach((crewMember) => {
                        crewToAdd.push(crewMember.id)
                    });
                    if (crewToAdd.length > 0){
                        movieToUpdate.crew = crewToAdd;
                    }
                }
                if (movieDetail.cast) {
                    var castToAdd = [];
                    movieDetail.cast.forEach((castMember) => {
                        castToAdd.push(castMember.id)
                    });
                    if (castToAdd.length > 0){
                        movieToUpdate.cast = castToAdd;
                    }
                }
                console.log(movieToUpdate);
                this.props.createMovieNoRedirect(movieToUpdate);
            }
        }
    }
    */

    render() {
        var movieDetail = {};
        var formattedYear = '';
        var overviewContent;
        var runtimeContent;
        var posterContent;
        var movieNightViewedContent = '';
        var crew = [];
        var crewContent;
        var cast = [];
        var castContent;
        var ratings = [];
        var ratingsContent;
        var genres = [];
        var genreContent;
        var imdbLinkContent;
        var tmdbLinkContent;
        var ratedContent;
        
        if (this.props.movieDetail && this.props.movieDetail.release_date) {

            movieDetail = this.props.movieDetail;
            overviewContent = (<p>{movieDetail.overview}</p>);
            
            genres = movieDetail.genres;
            genreContent = (
                <p>Genres: &nbsp;
                    {genres.map(({ _id, name }) => (
                        <Link to={`/allMovies/${name}`}>{name}&nbsp;</Link> 
                    ))}
                </p>);

            runtimeContent = (<p>Runtime: {movieDetail.runtime} minutes</p>);

            ratedContent = (<p>Rated: {movieDetail.rated}</p>);

            if (this.props.imdbId) {
                imdbLinkContent = <a href={`https://www.imdb.com/title/${this.props.imdbId}`} target="_blank">IMDB</a>
            }
            
            if (this.props.movieDetail.tmdbId) {
                tmdbLinkContent = <a href={`https://www.themoviedb.org/movie/${this.props.movieDetail.tmdbId}`} target="_blank">TMDB</a>
            }

            // format year
            formattedYear = (moment(movieDetail.release_date).format('YYYY'));

            if (movieDetail.imageBaseUrl && movieDetail.posterSizeL && movieDetail.poster_path) {
                posterContent = (
                    <img src={movieDetail.imageBaseUrl + movieDetail.posterSizeL + movieDetail.poster_path} style={{width: 185}} className={"floatLeft"} alt={movieDetail.title}></img>
                );
            }            

            if (movieDetail.movieNightViewed) {
                movieNightViewedContent = (
                    <div>
                        <p>This movie was viewed on <Link to={`/movieNight/${moment.utc(movieDetail.movieNightViewed.date).format('YYYY-MM-DD')}`}>{moment.utc(movieDetail.movieNightViewed.date).format('dddd, MMMM Do YYYY')}</Link>.</p>
                    </div>
                );
            } else {
                movieNightViewedContent = (
                    <div>
                        <p>This movie has not been viewed yet.</p>
                    </div>
                );
            }

            crew = movieDetail.crew;
            if (crew && crew[0].credit_id) {
                crewContent = (
                    <div>
                        <p>Writers and Directors:</p>
                        <ListGroup>
                            {crew.map(({ id, name, job }) => (
                                <ListGroupItem key={id}><Link to={`/castCrew/${id}`}>{name}</Link>: {job}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                );
            } else {
                crewContent = (
                    <div>
                        <p>No crew found</p>
                    </div>
                );
            }
            cast = movieDetail.cast;
            if (cast && cast[0].id) {
                castContent = (
                    <div>
                        <p>Cast:</p>
                        <ListGroup>
                            {cast.map(({ id, name, character }) => (
                                // <Link to={`/castCrew/${cast_id}`}>{title}</Link>
                                <ListGroupItem key={id}><Link to={`/castCrew/${id}`}>{name}</Link>: {character}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                );
            } else {
                castContent = (
                    <div>
                        <p>No cast found</p>
                    </div>
                );
            }
            ratings = movieDetail.ratings;
            if (ratings && ratings[0].Source) {
                ratingsContent = (
                    <div>
                        <p>Ratings:</p>
                        <ListGroup>
                            {ratings.map(({ Source, Value }) => (
                                <ListGroupItem>{Source}: {Value}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                );
            } else {
                ratingsContent = (
                    <div>
                        <p>No ratings found</p>
                    </div>
                );
            }
        }
        else // can't find movie from api (could be a tv show) - use basic info from our db
        {
            movieDetail = this.props.movieBasic;
            // format year
            formattedYear = (moment(movieDetail.releaseDate).format('YYYY'));

            if (movieDetail.imdbId) {
                imdbLinkContent = <a href={`https://www.imdb.com/title/${movieDetail.imdbId}`} target="_blank">IMDB</a>
            }
            
            // TODO: handle tv vs. movie better
            if (movieDetail.tmdbId) {
                 tmdbLinkContent = <a href={`https://www.themoviedb.org/tv/${movieDetail.tmdbId}`} target="_blank">TMDB</a>
            }
        }

        return(
            <div className='movieDetail'>
                <Row>
                    <Col xs="12">
                        <h3>{movieDetail.title} ({formattedYear})</h3>                        
                        {movieNightViewedContent}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {posterContent}
                        {overviewContent}
                        {runtimeContent}
                        {genreContent}
                        {ratedContent}
                        <p>{imdbLinkContent} | {tmdbLinkContent}</p>
                    </Col>
                </Row>                
                <Row>
                    <Col xs="12">
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {ratingsContent}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {crewContent}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        &nbsp;
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {castContent}
                    </Col>
                </Row>
            
                {/* 
                <form onSubmit={this.onSubmit}>                    
                    <input
                    type="submit"
                    value="Submit"
                    className="btn btn-info btn-block mt-4"
                    />
                </form>
                */}
                        
            </div>
        );
        
    }
}

MovieDetail.propTypes = {
    getMovieNights: PropTypes.func.isRequired,
    getMovieDetailsFromApi: PropTypes.func.isRequired,
    movieDetail: PropTypes.object,
    movieBasic: PropTypes.object,
    imdbId: PropTypes.string,
    movie: PropTypes.object.isRequired,
    movieNight: PropTypes.object
}

const mapStateToProps = (state) => ({
    movie: state.movie,
    movieNight: state.movieNight,
    movieDetail: state.movie.movieDetail,
    movieBasic: state.movie.movie
})

export default connect(mapStateToProps, { getMovieNights, getMovieDetailsFromApi, createMovieNoRedirect, createMovie })(MovieDetail);