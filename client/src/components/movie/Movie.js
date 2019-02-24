import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByImdbId } from '../../actions/movieActions';
import MovieDetail from './../movie/MovieDetail';
import moment from 'moment';
//import Spinner from '../common/Spinner';

class Movie extends Component {
  componentDidMount() {  
      console.log(this.props.match.params.imdbId)
      this.props.getMovieByImdbId(this.props.match.params.imdbId);
  }

  render() {
    const {movie} = this.props.movie;

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>{movie.imdb}</h2>
              <MovieDetail imdbId={this.props.match.params.imdbId}></MovieDetail>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Movie.propTypes = {
    getMovieByImdbId: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    movie: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  movie: state.movie,
  auth: state.auth
});

export default connect(mapStateToProps, { getMovieByImdbId })(Movie);
