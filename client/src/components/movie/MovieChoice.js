import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieByImdbId } from '../../actions/movieActions';
import moment from 'moment';

class MovieChoice extends Component {
    componentDidMount() {
        this.props.getMovieByImdbId(this.props.imdbId);
        //console.log(this.props.imdbId)
    }

    render() {
        const {movie} = this.props.movie;
        console.log(movie)

        // format year
        const formattedYear = (moment(movie.releaseDate).format('YYYY'));


        return(
            <div className='movieChoice'>
            <h3>{movie.title}</h3>
            <h5>{formattedYear}</h5>
        {/* <img src={props.src} className='picture'/>
        {props.children} */}
        </div>
        );
    }
}

MovieChoice.propTypes = {
    getMovieByImdbId: PropTypes.func.isRequired, 
    imdbId: PropTypes.object.isRequired,
    movie: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    movie: state.movie
})

export default connect(mapStateToProps, { getMovieByImdbId })(MovieChoice);