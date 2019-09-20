import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getMovieNights, getMovieNightsByHost, deleteMovieNight } from '../../actions/movieNightActions';
import { getMovies } from '../../actions/movieActions';
import PropTypes from 'prop-types';

class MovieNightList extends Component {
    componentDidMount() {
        this.props.getMovies();
        
        if (this.props.match.params.host) {
            this.props.getMovieNightsByHost(this.props.match.params.host);
        } else {
            this.props.getMovieNights();
        }
    }

    onDeleteClick = (id) => {
        this.props.deleteMovieNight(id);
    }

    render() {
        const { movieNights } = this.props.movieNight;
        const { movies } = this.props.movie;
        let movieNightsForList = [];
        let subtitle = "";

        if (this.props.match.params.host) {
            subtitle = this.props.match.params.host;
        } else {
            subtitle = "All";
        }

        if (movieNights && movies) {
            movieNights.forEach((movieNight) => { 
                var movieNightForList = {};
                movieNightForList.date = movieNight.date;
                movieNightForList.host = movieNight.host;
                movieNightForList.location = movieNight.location;
                movieNightForList.imdbId = movieNight.movieViewed;
                var i;
                for (i = 0; i < movies.length; i++) { 
                    if (movies[i].imdbId === movieNight.movieViewed) {
                        movieNightForList.title = movies[i].title;
                        movieNightForList.releaseDate = movies[i].releaseDate;
                        movieNightsForList.push(movieNightForList);
                        break;
                    }
                }
            });
        }


        return(
            <Container>
                <h1 className="display-5 mb-5">Movie Nights</h1>
                <label>{subtitle}</label>
                <ListGroup>
                    <TransitionGroup className="movie-night-list">
                        {movieNightsForList.map(({ _id, date, host, location, imdbId, title, releaseDate }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Link to={`/movieNight/${moment.utc(date).format('YYYY-MM-DD')}`}>{moment.utc(date).format('YYYY-MM-DD')}</Link> | <Link to={`/allMovieNights/${host}`}>{host}</Link> | {location} | <Link to={`/movie/${imdbId}`}>{title}</Link> ({moment(releaseDate).format('YYYY')})
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

MovieNightList.propTypes = {
    getMovies: PropTypes.func,
    getMovieNights: PropTypes.func,
    getMovieNightsByHost: PropTypes.func,
    movie:  PropTypes.object.isRequired,
    movieNight: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    movieNight: state.movieNight,
    movie: state.movie
})

export default connect(mapStateToProps, { getMovies, getMovieNights, getMovieNightsByHost, deleteMovieNight })(MovieNightList);