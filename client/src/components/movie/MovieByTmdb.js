import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieFromApiByTmdbId } from '../../actions/movieActions';


class MovieByTmdb extends Component {
  componentDidMount() {  
      this.props.getMovieFromApiByTmdbId(this.props.match.params.tmdbId);
  }

  render() {
    var movieDetailTmdb = {};
    
    if (this.props.movie.movieDetailTmdb && this.props.movie.movieDetailTmdb.tmdbId) {
        movieDetailTmdb = this.props.movie.movieDetailTmdb;

        // redirect to movie detail
        this.props.history.push(`/movie/${movieDetailTmdb.imdbId}`)
    }
    
    return (
      <div className="dashboard">
        
      </div>
    );
  }
}

MovieByTmdb.propTypes = {
    getMovieFromApiByTmdbId: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    movie: PropTypes.object.isRequired,
    movieDetailTmdb: PropTypes.object
};

const mapStateToProps = state => ({
  movie: state.movie,
  movieDetailTmdb: state.movie.movieDetail,
  auth: state.auth
});

export default connect(mapStateToProps, { getMovieFromApiByTmdbId })(MovieByTmdb);