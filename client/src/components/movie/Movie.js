import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByImdbId } from '../../actions/movieActions';
import MovieDetail from './../movie/MovieDetail';


class Movie extends Component {
  componentDidMount() {  
    if (this.props.match.params.imdbId) {
      console.log("this.props.match.params.imdbId: " + this.props.match.params.imdbId);
      this.props.getMovieByImdbId(this.props.match.params.imdbId);
    } else { //if (this.props.location.state.imdbId){
      console.log("this.props.location.state.imdbId: " + this.props.location.state.id);
      this.props.getMovieByImdbId(this.props.location.state.id);
    }
  }

  render() {
    var linkContent;
    if (this.props.match.params.imdbId) {
      linkContent = (
        <MovieDetail imdbId={this.props.match.params.imdbId}></MovieDetail>
      );
    } else if (this.props.location.state.id) {
      linkContent = (
        <MovieDetail imdbId={this.props.movieDetail.imdbId}></MovieDetail>
      );
    }
    
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {linkContent}
              {/* <MovieDetail imdbId={this.props.match.params.imdbId}></MovieDetail> */}
              {/* <MovieDetail imdbId={this.props.movieDetail.imdbId}></MovieDetail> */}
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
    movie: PropTypes.object.isRequired,
    movieDetail: PropTypes.object
};

const mapStateToProps = state => ({
  movie: state.movie,
  auth: state.auth
});

export default connect(mapStateToProps, { getMovieByImdbId })(Movie);
