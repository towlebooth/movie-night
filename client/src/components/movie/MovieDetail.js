import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieDetailsFromApi } from '../../actions/movieActions';
import { getMovieNights } from '../../actions/movieNightActions';
import moment from 'moment';

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
        var crew = [];
        var cast = [];
        var ratings = [];
        if (this.props.movieDetail) {
            movieDetail = this.props.movieDetail;

            // format year
            formattedYear = (moment(movieDetail.release_date).format('YYYY'));

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
            cast = movieDetail.cast;
            ratings = movieDetail.ratings;
        }

            return(
                <div className='movieDetail'>
                    <Row>
                        <Col xs="12">
                        <h3>{movieDetail.title} ({formattedYear})</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="4">
                                <img src={movieDetail.imageBaseUrl + movieDetail.posterSizeL + movieDetail.poster_path} style={{width: 185}} alt={movieDetail.title}></img>
                        </Col>
                        <Col xs="8">
                            <p>{movieDetail.overview}</p>
                            <p>Runtime: {movieDetail.runtime} minutes</p>
                            <p>Genres: {genres}</p>
                            <p>Rated: {movieDetail.rated}</p>
                            <p><a href={`https://www.imdb.com/title/${this.props.imdbId}`} target="_blank">IMDB</a></p>
                            <p>Ratings:</p>
                            <ListGroup>
                                {ratings.map(({ Source, Value }) => (
                                    <ListGroupItem>{Source}: {Value}</ListGroupItem>
                                ))}
                            </ListGroup>
                            <p>Select Crew:</p>
                            <ListGroup>
                                {crew.map(({ credit_id, name, job }) => (
                                    <ListGroupItem key={credit_id}>{name}: {job}</ListGroupItem>
                                ))}
                            </ListGroup>
                            <p>Select Cast:</p>
                            <ListGroup>
                                {cast.map(({ cast_id, name, character }) => (
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