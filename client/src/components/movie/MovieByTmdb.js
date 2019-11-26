import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieFromApiByTmdbId } from '../../actions/movieActions';
import { Redirect } from 'react-router-dom';
import { Button } from 'reactstrap';


class MovieByTmdb extends Component {
  async componentDidMount() {  
    // console.log("Chad - this.props.match.params.tmdbId: " + this.props.match.params.tmdbId)
    // this.props.getMovieFromApiByTmdbId(this.props.match.params.tmdbId);


    //   if (this.props.movie.movieDetailTmdb && this.props.movie.movieDetailTmdb.tmdbId) {
    //     //movieDetailTmdb = this.props.movie.movieDetailTmdb;
    //     console.log("Chad - this.props.movie.movieDetailTmdb: " + this.props.movie.movieDetailTmdb.imdbId)
    //     // redirect to movie detail
    //     //this.props.history.push(`/movie/${movieDetailTmdb.imdbId}`)
    //     this.props.history.push('/movie', { id: this.props.movie.movieDetailTmdb.imdbId })
        
    // }
    //this.getMovieFromApi();
  }

  onSubmit = async (e)  =>{
    e.preventDefault();
    await this.props.getMovieFromApiByTmdbId(this.props.match.params.tmdbId);
    if (this.props.movie.movieDetailTmdb && this.props.movie.movieDetailTmdb.imdbId) {
      console.log("!!this.props.movie.movieDetailTmdb.imdbId: " + this.props.movie.movieDetailTmdb.imdbId)
      var url = '/movie/' + this.props.movie.movieDetailTmdb.imdbId;
      this.props.history.push(url);        
    }

    // okay, so the above works.  Can we get it to work from the movie title click on person detail?  Add form

  }

  onButtonClick = async (e)  =>{
    e.preventDefault();
    await this.props.getMovieFromApiByTmdbId(this.props.match.params.tmdbId);
    if (this.props.movie.movieDetailTmdb && this.props.movie.movieDetailTmdb.imdbId) {
      console.log("!!this.props.movie.movieDetailTmdb.imdbId: " + this.props.movie.movieDetailTmdb.imdbId)
      var url = '/movie/' + this.props.movie.movieDetailTmdb.imdbId;
      this.props.history.push(url);        
    }

    // okay, so the above works.  Can we get it to work from the movie title click on person detail?  Add form

  }

  render() {
    var movieDetailTmdb = {};
    // if (this.props.movie.movieDetailTmdb && this.props.movie.movieDetailTmdb.tmdbId) {
    //     movieDetailTmdb = this.props.movie.movieDetailTmdb;
    //     console.log("Chad - this.props.movie.movieDetailTmdb: " + this.props.movie.movieDetailTmdb.imdbId)
    //     // redirect to movie detail
    //     //this.props.history.push(`/movie/${movieDetailTmdb.imdbId}`)
    //     this.props.history.push('/movie', { id: this.props.movie.movieDetailTmdb.imdbId })
        
    // }
    //this.getMovieFromApi();

     // if (this.props.movie.movieDetailTmdb && this.props.movie.movieDetailTmdb.tmdbId) {
    //     this.props.history.push('/movie', { id: this.props.movie.movieDetailTmdb.imdbId })
    // }

    

   
    
    return (

        // <Redirect to={{
        //     pathname: '/movie',
        //     state: { id: this.props.movie.movieDetailTmdb.imdbId }
        // }}
        // />
        <div>
    <form onSubmit={this.onSubmit}>                    
                    <input
                    type="submit"
                    value="Submit"
                    className="btn btn-info btn-block mt-4"
                    />
                    <Button color="link" onClick={this.onButtonClick}>Link</Button>
                </form>
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