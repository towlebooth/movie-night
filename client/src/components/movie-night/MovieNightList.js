import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getMovieNights, getMovieNightsByHost, deleteMovieNight } from '../../actions/movieNightActions';
import PropTypes from 'prop-types';

class MovieNightList extends Component {
    componentDidMount() {
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
        console.log(movieNights)
        return(
            <Container>
                
                <ListGroup>
                    <TransitionGroup className="movie-night-list">
                        {movieNights.map(({ _id, date, host, location }) => (
                            <CSSTransition key={_id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    {/* <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(this, _id)}
                                        >&times;
                                    </Button>
                                    &nbsp; */}
                                    <Link to={`/movieNight/${moment.utc(date).format('YYYY-MM-DD')}`}>{moment.utc(date).format('YYYY-MM-DD')}</Link> | <Link to={`/allMovieNights/${host}`}>{host}</Link> | {location}
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
    getMovieNights: PropTypes.func,
    getMovieNightsByHost: PropTypes.func,
    movieNight: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    movieNight: state.movieNight
})

export default connect(mapStateToProps, { getMovieNights, getMovieNightsByHost, deleteMovieNight })(MovieNightList);