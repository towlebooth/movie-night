import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';
import { connect } from 'react-redux';
import { getMovies } from '../actions/movieActions';
import PropTypes from 'prop-types';

class MovieList extends Component {
    componentDidMount() {
        this.props.getMovies();
    }

    render() {
        const { movies } = this.props.movie;
        return(
            <Container>
                <Button
                    color="dark"
                    style={{marginBottom: '2rem'}}
                    onClick={() => {
                        const title = prompt('Enter Movie');
                        if(title) {
                            this.setState(state => ({
                                movies: [...state.movies, { id: uuid(), title }]
                            }));
                        }
                    }}
                >Add Item</Button>

                <ListGroup>
                    <TransitionGroup className="movie-list">
                        {movies.map(({ id, title }) => (
                            <CSSTransition key={id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {                                      
                                            this.setState(state => ({
                                                movies: state.movies.filter(movie => movie.id !== id)
                                            }));
                                        }}
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

export default connect(mapStateToProps, { getMovies })(MovieList);