import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
//import moment from 'moment';
import { getHostingOrders } from '../../actions/hostingOrderActions';
import { getMovieNights } from '../../actions/movieNightActions';
import PropTypes from 'prop-types';

class HostingOrder extends Component {
    componentDidMount() {
        this.props.getHostingOrders();
        this.props.getMovieNights();
    }

    render() {
        const { hostingOrders } = this.props.hostingOrder;
        const { movieNights } = this.props.movieNight;
        let movieNightHostingOrders = [];

        // create objects with host name and last movie night date
        // TODO: switch to for loop so we can break once we set one combo per host
        if (hostingOrders && movieNights) {
            let recentMovieNights = movieNights.slice(0, 8);
            console.log(recentMovieNights);
            hostingOrders.forEach((hostingOrder) => {
                recentMovieNights.forEach((movieNight) => {
                    if (movieNight.host == hostingOrder.host) {
                        var movieNightHostingOrder = {
                            _id: hostingOrder._id, 
                            host: hostingOrder.host, 
                            order: hostingOrder.order, 
                            mostRecentDate: movieNight.date};
                        movieNightHostingOrders.push(movieNightHostingOrder);
                    }
                });
            });
            console.log(movieNightHostingOrders)
        //     var i;
        //     for (i = 0; i < hostingOrders.length; i++) { 
        //         var thing = {};
        //         thing = {}
        //     }
        }
        return(
            <Container>                
                <ListGroup>
                    {/* {hostingOrders.map(({ _id, host, order }) => (
                        <ListGroupItem key={_id}>
                            {host} {order}
                        </ListGroupItem>
                    ))} */}
                    {movieNightHostingOrders.map(({ _id, host, order, mostRecentDate }) => (
                        <ListGroupItem key={_id}>
                            {host} {order} {mostRecentDate}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Container>
        );
    }
}

HostingOrder.propTypes = {
    getHostingOrders: PropTypes.func.isRequired, 
    hostingOrder: PropTypes.object.isRequired,
    getMovieNights: PropTypes.func,
    movieNight: PropTypes.object
}

const mapStateToProps = (state) => ({
    hostingOrder: state.hostingOrder,
    movieNight: state.movieNight
})

export default connect(mapStateToProps, { getHostingOrders, getMovieNights })(HostingOrder);