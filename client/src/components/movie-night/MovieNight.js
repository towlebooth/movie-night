import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieNightByDate } from '../../actions/movieNightActions';
import { getMovieByImdbId } from '../../actions/movieActions';
//import MovieChoice from './../movie/MovieChoice';
import MovieDetail from './../movie/MovieDetail';
import moment from 'moment';
//import Spinner from '../common/Spinner';

class MovieNight extends Component {
  componentDidMount() {     
      this.props.getMovieNightByDate(this.props.match.params.date);
  }

  // componentWillReceiveProps() {
  //   this.props.getMovieNightByDate(this.props.match.params.date);
  // }

  render() {
    const { movieNight, loading } = this.props.movieNight
    if (loading) return <div><h3>Loading ...</h3></div>
    // const {movieSelected} = {};
    // const {movieChoice1} = {};
    // const {movieChoice2} = {};
    // const {movieChoice3} = {};

    // if (movieNight.movieChoicesRoundOne[0]) {
    //     this.props.get
      
    //   // TODO: get the movies here or just send over imdbId?

    //   //movieChoice1 = 
    // }
    console.log(movieNight);
    if (movieNight.movieChoicesRoundOne) {
        console.log(movieNight.movieChoicesRoundOne[0])
    }

    let movieNightContent;
    if (!movieNight.date) {
        movieNightContent = (
          <div>
            <h3>No movie found for the date of {this.props.match.params.date}</h3>
          </div>
        )
    }
    else {
      movieNightContent = (
          <div>
              <h3>{moment.utc(movieNight.date).format('dddd, MMMM Do YYYY')}</h3>
              <h5>{movieNight.host}</h5>
              <h5>{movieNight.location}</h5>
              <MovieDetail imdbId={movieNight.movieViewed}></MovieDetail>
          </div>
      )
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {movieNightContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MovieNight.propTypes = {
    getMovieNightByDate: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    movieNight: PropTypes.object.isRequired,
    getMovieByImdbId: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  movieNight: state.movieNight,
  auth: state.auth
});

export default connect(mapStateToProps, { getMovieNightByDate, getMovieByImdbId })(MovieNight);
