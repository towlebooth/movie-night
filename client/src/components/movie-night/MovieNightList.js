import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import SelectListGroup from '../common/SelectListGroup';
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

    onChange(e) {
        //console.log('Select clicked: ' + e.target.value)
        if (e.target.value === 0 || e.target.value === 'All') {
            window.location.href = '/allMovieNights/';
        } else {
        window.location.href = '/allMovieNights/' + e.target.value;
        }
    }

    render() {
        const { movieNights } = this.props.movieNight;
        const { movies } = this.props.movie;
        let movieNightsForList = [];
        let filter = "";

        // Select options for host name
        const hostOptions = [
            { label: 'All Movie Nights', value: 'All' },
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

        if (this.props.match.params.host) {
            filter = this.props.match.params.host;
        } else {
            filter = "All";
        }

        if (movieNights && movies) {
            movieNights.forEach((movieNight) => { 
                var movieNightForList = {};
                movieNightForList._id = movieNight._id;
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
                <label>Filter Movie Nights:</label>
                <SelectListGroup
                    placeholder="Host"
                    name="host"
                    value={filter}
                    onChange={this.onChange}
                    options={hostOptions}
                    //error={errors.host}
                    info=""
                />

                <Table>
                    <thead>
                        <tr>
                            <th>Movie Night</th>
                            <th>Host</th>
                            {/* <th>Location</th> */}
                            <th>Movie Viewed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movieNightsForList.map(({ _id, date, host, location, imdbId, title, releaseDate }) => (
                        <tr key={_id}>                            
                            <td><Link to={`/movieNight/${moment.utc(date).format('YYYY-MM-DD')}`}>{moment.utc(date).format('YYYY-MM-DD')}</Link></td>
                            <td><Link to={`/allMovieNights/${host}`}>{host}</Link></td>
                            {/* <td>{location}</td> */}
                            <td><Link to={`/movie/${imdbId}`}>{title}</Link> ({moment(releaseDate).format('YYYY')})</td>
                        </tr>
                        ))}
                    </tbody>
                </Table>

                {/*
                // the old non-table view
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
                */}
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