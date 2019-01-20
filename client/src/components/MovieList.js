import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import uuid from 'uuid';

class MovieList extends Component {
    state = {
        movies: [
            { id: uuid(), title: 'Casablanca'},
            { id: uuid(), title: 'Citizen Kane'},
            { id: uuid(), title: 'The Godfather'},
            { id: uuid(), title: 'The Big Lebowski'},
        ]
    }

    render() {
        const { movies } = this.state;
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

export default MovieList;