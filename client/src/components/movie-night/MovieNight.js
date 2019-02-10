import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieNightByDate } from '../../actions/movieNightActions';
import moment from 'moment';
//import Spinner from '../common/Spinner';

class MovieNight extends Component {
  componentDidMount() {     
      this.props.getMovieNightByDate(this.props.match.params.date);
  }

  render() {
    const {movieNight} = this.props.movieNight;
    
    //console.log('movie night date: ' + movieNight.date)

    let movieNightContent;
    movieNightContent = (
        <div>
            <h3>{moment(movieNight.date).format('dddd, MMMM Do YYYY')}</h3>
            <h5>{movieNight.host}</h5>
            <h5>{movieNight.location}</h5>
        </div>
    )

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
};

const mapStateToProps = state => ({
  movieNight: state.movieNight,
  auth: state.auth
});

export default connect(mapStateToProps, { getMovieNightByDate })(MovieNight);
