import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByImdbId } from '../../actions/movieActions';
import MovieDetail from './../movie/MovieDetail';


class Movie extends Component {
  componentDidMount() {  
      this.props.getMovieByImdbId(this.props.match.params.imdbId);
  }

  render() {
    
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
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
