import React, { Component } from 'react';
//import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
//import { getHostingOrders } from '../../actions/hostingOrderActions';
import { getMovieChoicesFromApi } from '../../actions/movieActions';
import PropTypes from 'prop-types';

class MovieChoiceList extends Component {
    componentDidMount() {
        this.props.getMovieChoicesFromApi(this.props.imdbIds);
    }

    render() {
        let movieChoices  = [];
        console.log(this.props.movieChoices);
        if (this.props && this.props.movieChoices) {
            movieChoices = this.props.movieChoices;
        }

        return(
           <div>
                {movieChoices.map(({id, title, release_date, poster_path, imageBaseUrl, posterSizeXS, imdb_id }) => (
                   <div>
                   <img src={imageBaseUrl + posterSizeXS + poster_path} style={{width: 94}} alt={title}></img>
                   <br/>
                   <Link to={`/movie/${imdb_id}`}>{title}</Link> ({moment(release_date).format('YYYY')})
                   </div>
                ))}
               
           </div>
           
        );
    }
}

MovieChoiceList.propTypes = {
    movieChoices: PropTypes.array,
}

const mapStateToProps = (state) => ({
    movieChoices: state.movie.movieChoices
})

export default connect(mapStateToProps, { getMovieChoicesFromApi })(MovieChoiceList);