import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPersonFromApiByTmdbId } from '../../actions/personActions';
import moment from 'moment';
import './../../App.css';

class PersonDetail extends Component {
    constructor(props) {
        super(props);
    }
    
    componentDidMount = async () => {
    }

    render() {
        var personDetail = {};
        var imdbLinkContent;
        var tmdbLinkContent;
        var posterContent;
        var biographyContent;
        var creditsCastForList = [];
        var castContent;
        var creditsCrewForList = [];
        var crewContent;

        if (this.props.person.personDetail && this.props.person.personDetail.tmdbId) {
            personDetail = this.props.person.personDetail;

            if (personDetail.imdbId) {
                imdbLinkContent = <a href={`https://www.imdb.com/name/${personDetail.imdbId}`} target="_blank">IMDB</a>
                tmdbLinkContent = <a href={`https://www.themoviedb.org/person/${personDetail.tmdbId}`} target="_blank">TMDB</a>
            
                if (personDetail.imageBaseUrl && personDetail.posterSizeL && personDetail.profile_path) {
                    posterContent = (
                        <img src={personDetail.imageBaseUrl + personDetail.posterSizeL + personDetail.profile_path} style={{width: 185}} className={"floatLeft"} alt={personDetail.name}></img>
                    );
                }
                
                if (personDetail.movieCredits.cast && personDetail.movies) {
                    personDetail.movieCredits.cast.forEach((castCredit) => { 
                        var creditForList = {};
                        creditForList.tmdbId = castCredit.id;
                        creditForList.releaseDate = castCredit.release_date;
                        creditForList.title = castCredit.title;
                        creditForList.imdbId = castCredit.imdbId;
                        creditForList.character = castCredit.character;
                        var i;
                        for (i = 0; i < personDetail.movies.length; i++) { 
                            if (personDetail.movies[i].imdbId === castCredit.imdbId) {
                                creditForList.viewed = "Viewed in Movie Club";
                                break;
                            } else {
                                creditForList.viewed = "Not Viewed Yet";
                            } 
                        }
                        //console.log('creditForList: ' + creditForList.title)
                        creditsCastForList.push(creditForList);
                    });
                }

                if (personDetail.movieCredits.crew && personDetail.movies) {
                    personDetail.movieCredits.crew.forEach((crewCredit) => { 
                        var creditForList = {};
                        creditForList.tmdbId = crewCredit.id;
                        creditForList.releaseDate = crewCredit.release_date;
                        creditForList.title = crewCredit.title;
                        creditForList.imdbId = crewCredit.imdbId;
                        creditForList.job = crewCredit.job;
                        var i;
                        for (i = 0; i < personDetail.movies.length; i++) { 
                            if (personDetail.movies[i].imdbId === crewCredit.imdbId) {
                                creditForList.viewed = "Viewed in Movie Club";
                                break;
                            } else {
                                creditForList.viewed = "Not Viewed Yet";
                            }                            
                        }
                        //console.log('creditForList: ' + creditForList.title)
                        creditsCrewForList.push(creditForList);
                    });
                }

                if (personDetail.biography) {
                    biographyContent = <p>{personDetail.biography}</p>
                }

                if (creditsCastForList && creditsCastForList[0].imdbId) {
                    castContent = (
                        <div>
                            <p>Acting Credits:</p>
                            <ListGroup>
                                {creditsCastForList.map(({ tmdbId, imdbId, character, title, releaseDate, viewed }) => (
                                    <ListGroupItem key={tmdbId}><Link to={`/movie/${imdbId}`}>{title}</Link> ({moment(releaseDate).format('YYYY')}): {character} | {viewed}</ListGroupItem>
                                ))}
                            </ListGroup>
                        </div>
                    );
                } else {
                    castContent = (
                        <div>
                            <p>No acting credits found</p>
                        </div>
                    );
                }

                if (creditsCrewForList && creditsCrewForList[0].imdbId) {
                    crewContent = (
                        <div>
                            <p>Select Crew Credits:</p>
                            <ListGroup>
                                {creditsCrewForList.map(({ tmdbId, imdbId, job, title, releaseDate, viewed }) => (
                                    <ListGroupItem key={tmdbId}><Link to={`/movie/${imdbId}`}>{title}</Link> ({moment(releaseDate).format('YYYY')}): {job} | {viewed}</ListGroupItem>
                                ))}
                            </ListGroup>
                        </div>
                    );
                } else {
                    crewContent = (
                        <div>
                            <p>No crew credits found</p>
                        </div>
                    );
                }
            }

            // if (movieNights && movies) {
            //     movies.forEach((movie) => { 
            //         var movieForList = {};
            //         movieForList._id = movie._id;
            //         movieForList.releaseDate = movie.releaseDate;
            //         movieForList.title = movie.title;
            //         movieForList.imdbId = movie.imdbId;
            //         var i;
            //         for (i = 0; i < movieNights.length; i++) { 
            //             if (movieNights[i].movieViewed === movie.imdbId) {
            //                 movieForList.dateWatched = movieNights[i].date;
            //                 break;
            //             } else {
            //                 movieForList.dateWatched = null;
            //             }                    
                        
            //         }
            //         moviesForList.push(movieForList);
            //     });
            // }
        }

        return(
            <div className='personDetail'>
                <Row>
                    <Col xs="12">
                        <h3>{personDetail.name}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {posterContent}
                        {biographyContent}                    
                        <p>{imdbLinkContent} | {tmdbLinkContent}</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {castContent}
                        {crewContent}
                    </Col>
                </Row>

            </div>
        );
        
    }
}

PersonDetail.propTypes = {
    getPersonFromApiByTmdbId: PropTypes.func.isRequired,
    //getMoviesByPerson: PropTypes.func.isRequired,
    person: PropTypes.object.isRequired,
    movie: PropTypes.object
}

const mapStateToProps = (state) => ({
    person: state.person,
    movie: state.movie,
    //personDetail: state.person.personDetail
})

export default connect(mapStateToProps, { getPersonFromApiByTmdbId })(PersonDetail);