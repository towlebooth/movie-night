import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getUserDetails } from '../../actions/userDetailActions';
import { getMovieNights } from '../../actions/movieNightActions';
import PropTypes from 'prop-types';

class HostingOrder extends Component {
    componentDidMount() {
        this.props.getUserDetails();
        this.props.getMovieNights();
    }

    render() {
        let hostingOrders = this.props.userDetail.userDetails;
        const { movieNights } = this.props.movieNight;
        let movieNightHostingOrders = [];
        let nextHostInOrder = {};
        var orderContent;

        if (hostingOrders && movieNights) {
            let recentMovieNights = movieNights.slice(0, 10);
            
            // build hosting order list
            hostingOrders.forEach((hostingOrder) => {
                var i;
                for (i = 0; i < recentMovieNights.length; i++) { 
                    if (recentMovieNights[i].host === hostingOrder.firstName) {
                        var orderDate = moment.utc(recentMovieNights[i].date).format('YYYY-MM-DD')
                        var movieNightHostingOrder = {
                            _id: hostingOrder._id, 
                            host: hostingOrder.firstName, 
                            order: hostingOrder.hostingOrder, 
                            mostRecentDate: orderDate};            
                        movieNightHostingOrders.push(movieNightHostingOrder);
                        break;
                    }
                }
            });

            // sort by order number
            var sortedMovieNightHostingOrders = movieNightHostingOrders.sort(function(a, b) {
                return new Date(a.order) - new Date(b.order);
            });

            // find next host            
            let hostingOrderCollection = movieNightHostingOrders.slice(0, 10);
            var hostingOrderByDate = hostingOrderCollection.sort(function(a, b) {
                return new Date(b.mostRecentDate) - new Date(a.mostRecentDate);
            });

            let mostTimeSinceHosted = hostingOrderByDate[hostingOrderByDate.length - 1];  // was correct until after a trade
            //let mostTimeSinceHosted = hostingOrderByDate[6];
            if (mostTimeSinceHosted) {                
                //console.log("mostTimeSinceHosted: " + mostTimeSinceHosted.host)
                movieNightHostingOrders.forEach((hostingOrderMovieNight) => {                    
                    if (hostingOrderMovieNight._id === mostTimeSinceHosted._id) {
                        hostingOrderMovieNight.isNext = true;
                        nextHostInOrder = hostingOrderMovieNight;
                    } else {
                        hostingOrderMovieNight.isNext = false;
                    }                    
                });
            }
            
            orderContent = (
                <div>
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
                            {sortedMovieNightHostingOrders.map(({ _id, order, host, mostRecentDate, isNext }) => (
                            <tr key={_id}>                            
                                <td>{parseInt(order) + 1}</td>
                                <td><Link to={`/allMovieNights/${host}`}>{host}</Link> {isNext ? '*' : ''}</td>
                                <td><Link to={`/movieNight/${moment.utc(mostRecentDate).format('YYYY-MM-DD')}`}>{moment.utc(mostRecentDate).format('MMMM Do YYYY')}</Link></td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>

                    <p>* Assuming there is no trade in progress, <Link to={`/allMovieNights/${nextHostInOrder.host}`}>{nextHostInOrder.host}</Link> is hosting next.</p> 
                    
                    </Container>
                </div>
            );
            
        } else {
            orderContent = (
                <div>No content found.</div>
            );
        }
        return(
            <div>
                {orderContent}
            </div>
        );
    }
}

HostingOrder.propTypes = {
    getUserDetails: PropTypes.func.isRequired, 
    userDetail: PropTypes.object.isRequired,
    getMovieNights: PropTypes.func,
    movieNight: PropTypes.object
}

const mapStateToProps = (state) => ({
    userDetail: state.userDetail,
    movieNight: state.movieNight
})

export default connect(mapStateToProps, { getUserDetails, getMovieNights })(HostingOrder);