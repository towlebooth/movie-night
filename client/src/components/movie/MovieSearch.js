import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { getMovies, searchForMovieByTitle } from '../../actions/movieActions';

 class MovieSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageBaseUrl: undefined,
            posterSizeXS: undefined,
            posterSizeS: undefined,
            searchResults: [],
            errors: {}
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {  
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }    
    }

    onSelectClick = async (imdb_id) => {
        // redirect to movie detail
        this.props.history.push(`/movie/${imdb_id}`)
    }

    getMovieFromApi = async (e) => {
        e.preventDefault();
        const titleForSearch = e.target.elements.titleForSearch.value;

        this.props.searchForMovieByTitle(titleForSearch);
    };

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { errors } = this.state;
        var movieSearchResults = [];    
        let searchResultsContent;   

        if (this.props.movieSearchResults && this.props.movieSearchResults[0]) {
            movieSearchResults = this.props.movieSearchResults;

            searchResultsContent = (
                
                <Container>
                    <Row>
                        <Col>
                            &nbsp;
                        </Col>
                    </Row>
                    <ListGroup>
                        {movieSearchResults.map(({ id, title, release_date, overview, poster_path, imageBaseUrl, posterSizeXS, imdb_id }) => (
                            <ListGroupItem key={id}>
                            <Row>
                                <Col xs="4">
                                    <img src={imageBaseUrl + posterSizeXS + poster_path} style={{width: 120}} alt={title}></img>
                                </Col>
                                <Col xs="8">
                                    <Button variant="primary" onClick={this.onSelectClick.bind(this, imdb_id)}>{title}</Button> ({moment(release_date).format('YYYY')})
                                    <p>{overview}</p>
                                </Col>
                            </Row>
                        </ListGroupItem>
                        ))}
                    </ListGroup>
                </Container>
              )
        } else {
            searchResultsContent = (
                <p></p>
            )
        }
        
        return (
            <div className="movie-search">
                <div className="container">                
    
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Search For Movie</h1>
                            <form onSubmit={this.getMovieFromApi}>
                                <TextFieldGroup
                                    placeholder="* Movie Title"
                                    name="titleForSearch"
                                    value={this.state.titleForSearch}
                                    onChange={this.onChange}
                                    error={errors.titleForSearch}
                                />
                                
                                <input
                                    type="submit"
                                    value="Search"
                                    className="btn btn-info btn-block mt-4"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="row">
                        {searchResultsContent}
                    </div>    
    
                </div>
            </div>
        );
      }
    }
    
    MovieSearch.propTypes = {
      errors: PropTypes.object.isRequired,
      movie: PropTypes.object.isRequired,
      movieSearchResults: PropTypes.array
    };
    
    const mapStateToProps = state => ({
      movie: state.movie,
      movieSearchResults: state.movie.movieSearchResults,
      errors: state.errors
    });
    
    export default connect(mapStateToProps, { getMovies, searchForMovieByTitle })(
      withRouter(MovieSearch)
    );