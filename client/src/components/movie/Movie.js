import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByTitle, getMovies } from '../../actions/movieActions';
import moment from 'moment';
import Spinner from '../common/Spinner';

class Movie extends Component {
  componentDidMount() {
      //this.props.getMovies();      
      this.props.getMovieByTitle(this.props.match.params.title);
  }

  render() {
    const {movie} = this.props.movie;
    //console.log('movie.title: ' + movie.title)

    // format year
    const formattedYear = (moment(movie.releaseDate).format('YYYY'));
    
    console.log('imdb: ' + movie.imdb)

    let movieContent;
    movieContent = (
        <div>
            <h3>{movie.title}</h3>
            <h5>{formattedYear}</h5>
            <img 
                src={movie.posterUrl} 
                alt={movie.title}
                style={{width: '100px', marginRight: '5px'}}
            >
            </img>
            <h5>Written by {movie.writers}</h5>
            <h5>Directed by {movie.directors}</h5>
            <h5>Starring {movie.actors}</h5>
            <h5>Genres {movie.genres}</h5>
            <h5>Runtime {movie.runTime}</h5>
            {/* <h5><Link to={`https://www.imdb.com/title/${movie.imdb.imdbId}`}>IMDB Rating {movie.imdb.imdbRating}</Link></h5> */}
        </div>
    )

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {movieContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Movie.propTypes = {
    getMovieByTitle: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    movie: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  movie: state.movie,
  auth: state.auth
});

export default connect(mapStateToProps, { getMovieByTitle })(Movie);
