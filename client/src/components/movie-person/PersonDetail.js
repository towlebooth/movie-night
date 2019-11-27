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
        var nameContent;
        var imdbLinkContent;
        var tmdbLinkContent;
        var linkContent;
        var posterContent;
        var biographyContent;
        var creditsCastForList = [];
        var castContent;
        var creditsCrewForList = [];
        var crewContent;

        if (this.props.person.personDetail && this.props.person.personDetail.tmdbId) {
            personDetail = this.props.person.personDetail;

            if (personDetail.imdbId) {
                nameContent = <h3>{personDetail.name}</h3>
                imdbLinkContent = <a href={`https://www.imdb.com/name/${personDetail.imdbId}`} target="_blank">IMDB</a>
                tmdbLinkContent = <a href={`https://www.themoviedb.org/person/${personDetail.tmdbId}`} target="_blank">TMDB</a>
                linkContent = <p>{imdbLinkContent} | {tmdbLinkContent}</p>
                
                if (personDetail.imageBaseUrl && personDetail.posterSizeL && personDetail.profile_path) {
                    posterContent = (
                        <img src={personDetail.imageBaseUrl + personDetail.posterSizeL + personDetail.profile_path} style={{width: 185}} className={"floatLeft"} alt={personDetail.name}></img>
                    );
                }

                if (personDetail.biography) {
                    biographyContent = <p>{personDetail.biography}</p>
                }

                // movies from club we've watched
                // var creditForList = {};
                // var i;
                // for (i = 0; i < personDetail.movies.length; i++) { 
                //     if (personDetail.movies[i].imdbId === castCredit.imdbId) {
                //         creditForList.viewed = "Viewed in Movie Club";
                //         break;
                //     } else {
                //         creditForList.viewed = "Not Viewed Yet";
                //     } 
                // }
                
                // acting credits (cast)
                if (personDetail.movieCredits.cast && personDetail.movies) {
                    personDetail.movieCredits.cast.forEach((castCredit) => { 
                        var creditForList = {};
                        creditForList.tmdbId = castCredit.tmdbId;
                        creditForList.releaseDate = castCredit.release_date;
                        creditForList.title = castCredit.title;
                        //creditForList.imdbId = castCredit.imdbId;
                        creditForList.character = castCredit.character;
                        var i;
                        for (i = 0; i < personDetail.movies.length; i++) {
                            personDetail.movies[i].cast.forEach((castMovie) => {
                                //console.log("castMovie = " + castMovie + " | " + "castCredit.tmdbId: " + castCredit.tmdbId);
                                if (castMovie === castCredit.tmdbId) {
                                    console.log("match found in cast loop person detail")
                                    creditForList.viewed = "Viewed in Movie Club";
                                    //break;
                                } else {
                                    creditForList.viewed = "Not Viewed Yet";
                                } 
                            });
                        }
                        //console.log('creditForList: ' + creditForList.title)
                        creditsCastForList.push(creditForList);

                        // sort by date
                        // if (creditsCastForList && creditsCastForList.length > 0) {
                        //     creditsCastForList.sort(function(a, b) {
                        //         a = new Date(a.releaseDate);
                        //         b = new Date(b.releaseDate);
                        //         return a>b ? -1 : a<b ? 1 : 0;
                        //     });
                        // }
                    });
                }

                console.log("personDetail.movieCredits.crew.length: " + personDetail.movieCredits.crew.length);
                // writing and directing credits (crew)
                if (personDetail.movieCredits.crew && personDetail.movies) {
                    personDetail.movieCredits.crew.forEach((crewCredit) => { 
                        var creditForList = {};
                        creditForList.tmdbId = crewCredit.tmdbId;
                        creditForList.releaseDate = crewCredit.release_date;
                        creditForList.title = crewCredit.title;
                        creditForList.key = crewCredit.key;
                        //creditForList.imdbId = crewCredit.imdbId;
                        creditForList.job = crewCredit.job;
                        var i;
                        for (i = 0; i < personDetail.movies.length; i++) { 
                            if (personDetail.movies[i].tmdbId === crewCredit.tmdbId) {
                                creditForList.viewed = "Viewed in Movie Club";
                                break;
                            } else {
                                creditForList.viewed = "Not Viewed Yet";
                            }                            
                        }
                        creditsCrewForList.push(creditForList);

                        // sort by date
                        // if (creditsCrewForList && creditsCrewForList.length > 0) {
                        //     creditsCrewForList.sort(function(a, b) {
                        //         a = new Date(a.releaseDate);
                        //         b = new Date(b.releaseDate);
                        //         return a>b ? -1 : a<b ? 1 : 0;
                        //     });
                        // }
                    });
                }

                
                if (creditsCastForList && creditsCastForList[0] && creditsCastForList[0].tmdbId) {
                    castContent = (
                        <div>
                            <p>Acting Credits:</p>
                            <ListGroup>
                                {creditsCastForList.map(({ tmdbId, character, title, releaseDate, viewed }) => (
                                    <ListGroupItem key={tmdbId}>{title} ({moment(releaseDate).format('YYYY')}): {character}</ListGroupItem>
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

                console.log("creditsCrewForList.length: " + creditsCrewForList.length);

                if (creditsCrewForList && creditsCrewForList[0] && creditsCrewForList[0].tmdbId) {
                    crewContent = (
                        <div>
                            <p>Writing and Directing Credits:</p>
                            <ListGroup>
                                {creditsCrewForList.map(({ key, tmdbId, job, title, releaseDate, viewed }) => (
                                    <ListGroupItem key={key}>{title} ({moment(releaseDate).format('YYYY')}): {job}</ListGroupItem>
                                ))}
                            </ListGroup>
                        </div>
                    );
                } else {
                    crewContent = (
                        <div>
                            <p>No writing or directing credits found</p>
                        </div>
                    );
                }
            }

            
        } else {
            // no record found
            nameContent = <p>No record found</p>
        }

        return(
            <div className='personDetail'>
                <Row>
                    <Col xs="12">
                        {nameContent}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {posterContent}
                        {biographyContent}                    
                        {linkContent}
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