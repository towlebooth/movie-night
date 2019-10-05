import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getMovieChoicesFromApi } from '../../actions/movieActions';
import PropTypes from 'prop-types';

class MovieChoiceList extends Component {
    componentDidMount() {
        this.props.getMovieChoicesFromApi(this.props.imdbIds);
    }

    render() {
        let movieChoices  = [];
        if (this.props && this.props.movieChoices) {
            movieChoices = this.props.movieChoices;
        }

        return(
           <div>
                <Table>
                    <tbody>
                        <tr>
                            {movieChoices.map(({id, title, release_date, poster_path, imageBaseUrl, posterSizeXS, imdb_id }) => (
                                <td key={id}>
                                    <img src={imageBaseUrl + posterSizeXS + poster_path} style={{width: 94}} alt={title}></img>
                                    <br/>
                                    <Link to={`/movie/${imdb_id}`}>{title}</Link> ({moment(release_date).format('YYYY')})
                                </td>                            
                            ))}
                        </tr>
                    </tbody>
                </Table>           
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