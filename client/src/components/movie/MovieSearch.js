import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import { getMovies } from '../../actions/movieActions';
import { 
    MOVIE_DB_API_KEY, 
    MOVIE_DB_BASE_URL
 } from '../common/keys';

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
        //this.props.getMovies();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }    
    }

    onSelectClick = async (id) => {
        const api_call = await fetch(`${MOVIE_DB_BASE_URL}movie/${id}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        console.log(data);

        this.props.history.push(`/movie/${data.imdb_id}`)

        this.setState({
                titleFirst: data.title,
                releaseDateFirst: data.release_date,
                imdbIdFirst: data.imdb_id,
                tmdbIdFirst: data.id.toString(),
                searchResults: [],
                error: ""
            });
    }

    getMovieFromApi = async (e) => {
        e.preventDefault();
        const titleForSearch = e.target.elements.titleForSearch.value;

        const api_searchMovie_call =
            await fetch(`${MOVIE_DB_BASE_URL}search/movie?api_key=${MOVIE_DB_API_KEY}&language=en-US&query=${titleForSearch}&page=1&include_adult=false`);
            const searchData = await api_searchMovie_call.json();
            //console.log(searchData);

            var searchResultId;

            if (searchData.results) 
            {
                searchResultId = searchData.results[0].id;

                // limit search results to 5
                var results = searchData.results;
                var limitedResults = results.slice(0,5);
                this.setState({searchResults: limitedResults});
            }

        const api_configuration_call = 
            await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
        const configData = await api_configuration_call.json();
        //console.log(configData);
        if (configData.images) {
            this.setState({
                imageBaseUrl: configData.images.base_url,
                posterSizeXS: configData.images.poster_sizes[0],
                posterSizeS: configData.images.poster_sizes[1]
            });
        } else {
            this.setState({
                imageBaseUrl: undefined,
                posterSizeXS: undefined,
                posterSizeS: undefined
            });
        }        
    };

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { errors } = this.state;
        
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
                        <Container>
                            <ListGroup>
                                {this.state.searchResults.map(({ id, title, release_date, overview, poster_path }) => (
                                    <ListGroupItem key={id}>
                                    <Row>
                                        <Col xs="4">
                                            <img src={this.state.imageBaseUrl + this.state.posterSizeXS + poster_path} style={{width: 120}} alt={title}></img>
                                        </Col>
                                        <Col xs="8">
                                            {/* <Button 
                                                className="select-btn"
                                                color="secondary"
                                                size="sm"
                                                onClick={this.onSelectClick.bind(this, id)}
                                                >Select
                                            </Button>
                                            &nbsp; */}
                                            <Button variant="primary" onClick={this.onSelectClick.bind(this, id)}>{title}</Button> ({moment(release_date).format('YYYY')})
                                            <p>{overview}</p>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                ))}
                            </ListGroup>
                        </Container>
                    </div>    
    
                </div>
            </div>
        );
      }
    }
    
    MovieSearch.propTypes = {
      errors: PropTypes.object.isRequired,
      movie: PropTypes.object.isRequired
    };
    
    const mapStateToProps = state => ({
      movie: state.movie,
      errors: state.errors
    });
    
    export default connect(mapStateToProps, { getMovies })(
      withRouter(MovieSearch)
    );