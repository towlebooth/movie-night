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
        // this.state = {
        //     movieToUpdatetoDB: undefined
        // };
    }
    
    componentDidMount = async () => {
        //this.props.getPersonFromApiByTmdbId(this.props.match.params.personTmdbId);
        //this.props.getPersonFromApiByTmdbId(this.props.personTmdbId);
        
    }

    render() {
        var personDetail = {};
        var imdbLinkContent;
        var tmdbLinkContent;

        if (this.props.person.personDetail && this.props.person.personDetail.tmdbId) {
            personDetail = this.props.person.personDetail;

            if (personDetail.imdbId) {
                imdbLinkContent = <a href={`https://www.imdb.com/name/${personDetail.imdbId}`} target="_blank">IMDB</a>
            }
            
            if (personDetail.tmdbId) {
                tmdbLinkContent = <a href={`https://www.themoviedb.org/person/${personDetail.tmdbId}`} target="_blank">TMDB</a>
            }
            console.log("personDetail on PersonDetail: " + personDetail.name);

            // var personMovies = await this.props.getMoviesByPerson(this.props.personTmdbId);
            // console.log(personMovies[0]);

            console.log('componentDidMount: ' + this.props.person.personDetail.tmdbId);
            //this.props.getMoviesByPerson(this.props.person.personDetail.tmdbId);
        }

        return(
            <div className='personDetail'>
                <h2>{personDetail.name}</h2>
                <p>Birthday: {personDetail.birthday}</p>
                <p>{imdbLinkContent} | {tmdbLinkContent}</p>
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