import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getMovies, getMoviesByGenre, deleteMovie } from '../../actions/movieActions';
import { getMovieNights } from '../../actions/movieNightActions';
import PropTypes from 'prop-types';

class MovieList extends Component {
    componentDidMount() {
        //if (!this.props.movieNight){
            //console.log('getting new movieNight collection on movieList')
            this.props.getMovieNights();
        //}

        if (this.props.match.params.genre) {
            //console.log('getting movies by ' + this.props.match.params.genre + ' from movieList view')
            this.props.getMoviesByGenre(this.props.match.params.genre);
        } else {
            this.props.getMovies();
        }
    }

    onDeleteClick = (id) => {
        this.props.deleteMovie(id);
    }

    render() {
        const { movies } = this.props.movie;
        //console.log('movies on movieList: ' + movies);
        const { movieNights } = this.props.movieNight;
        let moviesForList = [];

        if (movieNights && movies) {
            movies.forEach((movie) => { 
                var movieForList = {};
                movieForList._id = movie._id;
                movieForList.releaseDate = movie.releaseDate;
                movieForList.title = movie.title;
                movieForList.imdbId = movie.imdbId;
                var i;
                for (i = 0; i < movieNights.length; i++) { 
                    if (movieNights[i].movieViewed === movie.imdbId) {
                        movieForList.dateWatched = movieNights[i].date;
                        break;
                    } else {
                        movieForList.dateWatched = null;
                    }                    
                    moviesForList.push(movieForList);
                }
            });
        }
        return(
            <Container>                
                <ListGroup>
                    <TransitionGroup className="movie-list">
                        {moviesForList.map(({ _id, title, releaseDate, imdbId, dateWatched }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Link to={`/movie/${imdbId}`}>{title}</Link> ({moment(releaseDate).format('YYYY')})                                    
                                    
                                    {dateWatched ? (
                                        <Link to={`/movieNight/${moment.utc(dateWatched).format('YYYY-MM-DD')}`}> {moment.utc(dateWatched).format('YYYY-MM-DD')}</Link>
                                      ) : (
                                        <label>&nbsp;not watched</label>
                                      )}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

MovieList.propTypes = {
    getMovies: PropTypes.func.isRequired,
    getMoviesByGenre: PropTypes.func,
    getMovieNights: PropTypes.func,
    movie: PropTypes.object.isRequired,    
    movieNight: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    movie: state.movie,
    movieNight: state.movieNight
})

export default connect(mapStateToProps, { getMovies, getMoviesByGenre, getMovieNights, deleteMovie })(MovieList);