import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
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

        if (hostingOrders && movieNights) {
            let recentMovieNights = movieNights.slice(0, 10);
            hostingOrders.forEach((hostingOrder) => {                             
                var i;
                for (i = 0; i < recentMovieNights.length; i++) { 
                    if (recentMovieNights[i].host === hostingOrder.host) {
                        var orderDate = moment.utc(recentMovieNights[i].date).format('YYYY-MM-DD')
                        var movieNightHostingOrder = {
                            _id: hostingOrder._id, 
                            host: hostingOrder.host, 
                            order: hostingOrder.order, 
                            mostRecentDate: orderDate};
                        movieNightHostingOrders.push(movieNightHostingOrder);
                        break;
                    }
                }
            });
        }
        return(
            <Container>
                <h1 className="display-5 mb-5">Hosting Order</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Host</th>
                            <th>Last Movie Night</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movieNightHostingOrders.map(({ _id, order, host, mostRecentDate }) => (
                        <tr>                            
                            <td>{order + 1}</td>
                            <td><Link to={`/allMovieNights/${host}`}>{host}</Link></td>
                            <td><Link to={`/movieNight/${moment.utc(mostRecentDate).format('YYYY-MM-DD')}`}>{moment.utc(mostRecentDate).format('MMMM Do YYYY')}</Link></td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
                
                {/*
                <ListGroup>
                    {movieNightHostingOrders.map(({ _id, host, mostRecentDate }) => (
                        <ListGroupItem key={_id}>
                            <Link to={`/allMovieNights/${host}`}>{host}</Link> last hosted on <Link to={`/movieNight/${moment.utc(mostRecentDate).format('YYYY-MM-DD')}`}>{moment.utc(mostRecentDate).format('MMMM Do YYYY')}</Link> 
                        </ListGroupItem>
                    ))}
                </ListGroup>
                    */}
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