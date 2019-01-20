import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getMovies, deleteMovie } from '../actions/movieActions';
import PropTypes from 'prop-types';

class MovieList extends Component {
    componentDidMount() {
        this.props.getMovies();
    }

    onDeleteClick = (id) => {
        this.props.deleteMovie(id);
    }

    render() {
        const { movies } = this.props.movie;
        return(
            <Container>
                
                <ListGroup>
                    <TransitionGroup className="movie-list">
                        {movies.map(({ id, title }) => (
                            <CSSTransition key={id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(this, id)}
                                        >&times;
                                    </Button>
                                    {title}
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
    movie: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    movie: state.movie
})

export default connect(mapStateToProps, { getMovies, deleteMovie })(MovieList);