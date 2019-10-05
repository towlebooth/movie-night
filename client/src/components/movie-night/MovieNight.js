import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMovieNightByDate } from '../../actions/movieNightActions';
import MovieDetail from './../movie/MovieDetail';
import MovieChoiceList from './../movie/MovieChoiceList';
import moment from 'moment';

class MovieNight extends Component {
  componentDidMount() {     
      this.props.getMovieNightByDate(this.props.match.params.date);
  }

  render() {
    const { movieNight, loading } = this.props.movieNight
    if (loading) return <div><h3>Loading ...</h3></div>

    let movieNightContent;
    if (!movieNight.date) {
        movieNightContent = (
          <div>
            <h3>No movie night found for the date of {this.props.match.params.date}</h3>
          </div>
        )
    }
    else {
      movieNightContent = (
          <div>
              <h3>{moment.utc(movieNight.date).format('dddd, MMMM Do YYYY')}</h3>
              <h5>Hosted by <Link to={`/allMovieNights/${movieNight.host}`}>{movieNight.host}</Link> in {movieNight.location}</h5>
              <h5>Choices:</h5>
              <MovieChoiceList imdbIds={movieNight.movieChoicesRoundOne}></MovieChoiceList>
              <h5>Movie Viewed:</h5>
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
    movieNight: PropTypes.object.isRequired
    //getMovieByImdbId: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  movieNight: state.movieNight,
  auth: state.auth
});

export default connect(mapStateToProps, { getMovieNightByDate })(MovieNight);
