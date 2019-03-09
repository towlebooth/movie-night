import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
//import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
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
        const api_call = 
        await fetch(`${MOVIE_DB_BASE_URL}movie/${id}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        console.log(data);

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
            console.log(searchData);
            console.log(searchData.results[0])
            const searchResultId = searchData.results[0].id;
            this.setState({searchResults: searchData.results});

        const api_configuration_call = 
            await fetch(`${MOVIE_DB_BASE_URL}configuration?api_key=${MOVIE_DB_API_KEY}`);
        const configData = await api_configuration_call.json();
        console.log(configData);
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

        const api_call = 
            await fetch(`${MOVIE_DB_BASE_URL}movie/${searchResultId}?api_key=${MOVIE_DB_API_KEY}`);
        const data = await api_call.json();
        console.log(data);
    };

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { errors } = this.state;
        
        return (
            <div className="movie-search">
                <div className="container">                
    
                    {/* <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Create Your Movie Night</h1>
                            <p className="lead text-center">
                                Let's get some information to make your movie night stand out
                            </p>
                            <small className="d-block pb-3">* = required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    name="date"
                                    placeholder="Date"
                                    type="date"
                                    value={this.state.date}
                                    onChange={this.onChange}
                                    error={errors.date}
                                    info="Date of movie night"
                                />
                                <SelectListGroup
                                    placeholder="Host"
                                    name="host"
                                    value={this.state.host}
                                    onChange={this.onChange}
                                    options={hostOptions}
                                    error={errors.host}
                                    info=""
                                />
                                <SelectListGroup
                                    placeholder="Location"
                                    name="location"
                                    value={this.state.location}
                                    onChange={this.onChange}
                                    options={locationOptions}
                                    error={errors.location}
                                    info=""
                                />
                                <h6>Choice 1</h6>
                                <p>{this.state.titleFirst} ({moment(this.state.releaseDateFirst).format('YYYY')})</p>
                                <h6>Choice 2</h6>
                                <p>{this.state.titleSecond} ({moment(this.state.releaseDateSecond).format('YYYY')})</p>
                                <h6>Choice 3</h6>
                                <p>{this.state.titleThird} ({moment(this.state.releaseDateThird).format('YYYY')})</p>
    
                                
                                <input
                                type="submit"
                                value="Submit"
                                className="btn btn-info btn-block mt-4"
                                />
                            </form>
                        </div>
                    </div> */}
    
    
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
                                {this.state.searchResults.map(({ id, title, release_date, overview, poster_path, imdb_id }) => (
                                    <ListGroupItem key={id}>
                                    <Row>
                                        <Col xs="4">
                                            <img src={this.state.imageBaseUrl + this.state.posterSizeXS + poster_path} style={{width: 120}} alt={title}></img>
                                        </Col>
                                        <Col xs="8">
                                            <Button 
                                                className="select-btn"
                                                color="secondary"
                                                size="sm"
                                                onClick={this.onSelectClick.bind(this, id)}
                                                >Select
                                            </Button>
                                            &nbsp;<Link to={`/movie/${imdb_id}`}>{title}</Link> ({moment(release_date).format('YYYY')}) {overview}
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



