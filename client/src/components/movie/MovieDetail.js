import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieDetailsFromApi } from '../../actions/movieActions';
import { getMovieNights } from '../../actions/movieNightActions';
import moment from 'moment';

import './../../App.css';

class MovieDetail extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount = async () => {
        this.props.getMovieDetailsFromApi(this.props.imdbId);
    }

    render() {
        var movieDetail = {};
        var formattedYear = '';
        var posterContent;
        var movieNightViewedContent = '';
        var crew = [];
        var crewContent;
        var cast = [];
        var castContent;
        var ratings = [];
        var ratingsContent;
        
        if (this.props.movieDetail && this.props.movieDetail.release_date) {
            movieDetail = this.props.movieDetail;
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

            // format genres
            var genres = "";
            if (movieDetail.genres && movieDetail.genres.length > 0) {
                var genreArray = movieDetail.genres;
                genreArray.forEach((genre) => {
                    genres = genres + genre.name + ', '
                });
                genres = genres.slice(0, -2);
            }

            crew = movieDetail.crew;
            if (crew && crew[0].credit_id) {
                crewContent = (
                    <div>
                        <p>Select Crew:</p>
                        <ListGroup>
                            {crew.map(({ credit_id, name, job }) => (
                                <ListGroupItem key={credit_id}>{name}: {job}</ListGroupItem>
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
            if (cast && cast[0].cast_id) {
                castContent = (
                    <div>
                        <p>Select Cast:</p>
                        <ListGroup>
                            {cast.map(({ cast_id, name, character }) => (
                                <ListGroupItem key={cast_id}>{name}: {character}</ListGroupItem>
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

        return(
            <div className='movieDetail'>
                <Row>
                    <Col xs="12">
                        <h3>{movieDetail.title} ({formattedYear})</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {posterContent}
                        {movieNightViewedContent}
                        <p>{movieDetail.overview}</p>
                        <p>Runtime: {movieDetail.runtime} minutes</p>
                        <p>Genres: {genres}</p>
                        <p>Rated: {movieDetail.rated}</p>
                        <p><a href={`https://www.imdb.com/title/${this.props.imdbId}`} target="_blank">IMDB</a></p>
                        {ratingsContent}
                        {crewContent}
                        {castContent}
                    </Col>
                </Row>
            </div>
        );
        
    }
}

MovieDetail.propTypes = {
    getMovieNights: PropTypes.func.isRequired,
    getMovieDetailsFromApi: PropTypes.func.isRequired,
    movieDetail: PropTypes.object.isRequired,
    imdbId: PropTypes.string,
    movie: PropTypes.object.isRequired,
    movieNight: PropTypes.object
}

const mapStateToProps = (state) => ({
    movie: state.movie,
    movieNight: state.movieNight,
    movieDetail: state.movie.movieDetail
})

export default connect(mapStateToProps, { getMovieNights, getMovieDetailsFromApi })(MovieDetail);