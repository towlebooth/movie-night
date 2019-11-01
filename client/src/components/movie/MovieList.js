import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import SelectListGroup from '../common/SelectListGroup';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getMovies, getMoviesByGenre, deleteMovie } from '../../actions/movieActions';
import { getMovieNights } from '../../actions/movieNightActions';
import PropTypes from 'prop-types';

class MovieList extends Component {
    componentDidMount() {
        this.props.getMovieNights();

        if (this.props.match.params.genre) {
            this.props.getMoviesByGenre(this.props.match.params.genre);
        } else {
            this.props.getMovies();
        }
    }

    onDeleteClick = (id) => {
        this.props.deleteMovie(id);
    }

    onChange(e) {
        //console.log('Select clicked: ' + e.target.value)
        if (e.target.value === 0 || e.target.value === 'All') {
            window.location.href = '/allMovies/';
        } else {
        window.location.href = '/allMovies/' + e.target.value;
        }
    }

    render() {
        const { movies } = this.props.movie;
        //console.log('movies on movieList: ' + movies);
        const { movieNights } = this.props.movieNight;
        let moviesForList = [];
        let filter = "";

        // Select options for host name
        const genreOptions = [
            { label: 'All Movies', value: 'All' },
            { label: 'Action', value: 'Action' },
            { label: 'Adventure', value: 'Adventure' },
            { label: 'Animation', value: 'Animation' },
            { label: 'Comedy', value: 'Comedy' },
            { label: 'Crime', value: 'Crime' },
            { label: 'Documentary', value: 'Documentary' },
            { label: 'Drama', value: 'Drama' },
            { label: 'Family', value: 'Family' },
            { label: 'Fantasy', value: 'Fantasy' },
            { label: 'History', value: 'History' },
            { label: 'Horror', value: 'Horror' },
            { label: 'Music', value: 'Music' },
            { label: 'Mystery', value: 'Mystery' },
            { label: 'Romance', value: 'Romance' },
            { label: 'Science Fiction', value: 'Science Fiction' },
            { label: 'Thriller', value: 'Thriller' },
            { label: 'War', value: 'War' },
            { label: 'Western', value: 'Western' }
        ];

        if (this.props.match.params.genre) {
            filter = this.props.match.params.genre;
        } else {
            filter = "All";
        }

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
                    
                }
                moviesForList.push(movieForList);
            });
        }
        return(
            <Container>              
                <h1 className="display-5 mb-5">Club Movies</h1>
                <label>Filter Movies by Genre:</label>
                <SelectListGroup
                    placeholder="Genre"
                    name="genre"
                    value={filter}
                    onChange={this.onChange}
                    options={genreOptions}
                    //error={errors.host}
                    info=""
                />

                <Table>
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Movie Night Viewed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moviesForList.map(({ _id, title, releaseDate, imdbId, dateWatched }) => (
                        <tr key={_id}>                            
                            <td><Link to={`/movie/${imdbId}`}>{title}</Link> ({moment(releaseDate).format('YYYY')})</td>
                            <td>{dateWatched ? (
                                        <Link to={`/movieNight/${moment.utc(dateWatched).format('YYYY-MM-DD')}`}> {moment.utc(dateWatched).format('YYYY-MM-DD')}</Link>
                                      ) : (
                                        <label>&nbsp;not viewed</label>
                                      )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
                
                {/*
                <ListGroup>
                    <TransitionGroup className="movie-list">
                        {moviesForList.map(({ _id, title, releaseDate, imdbId, dateWatched }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Link to={`/movie/${imdbId}`}>{title}</Link> ({moment(releaseDate).format('YYYY')})                                    
                                    
                                    {dateWatched ? (
                                        <Link to={`/movieNight/${moment.utc(dateWatched).format('YYYY-MM-DD')}`}> {moment.utc(dateWatched).format('YYYY-MM-DD')}</Link>
                                      ) : (
                                        <label>&nbsp;not viewed</label>
                                      )}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
                */}
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