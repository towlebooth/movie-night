import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
//import moment from 'moment';
import { getUserDetails } from '../../actions/userDetailActions';
import PropTypes from 'prop-types';

class StreamingServices extends Component {
    componentDidMount() {
        this.props.getUserDetails();
    }

    render() {
        let userDetails = this.props.userDetail.userDetails;
        var hostServices = [];

        if (userDetails) {
            userDetails.forEach((userDetail) => {
                var hostService = {
                    _id: userDetail._id, 
                    host: userDetail.firstName,
                    services: userDetail.streamingServices.join(", "),
                    hostingOrder: userDetail.hostingOrder          
                }
                hostServices.push(hostService);
            });

            // sort by order number
            var sortedHostServices = hostServices.sort(function(a, b) {
                return new Date(a.hostingOrder) - new Date(b.hostingOrder);
            });
        }

        return(
            <Container>
                <h1 className="display-5 mb-5">Streaming Services</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>Host</th>
                            <th>Streaming Services</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHostServices.map(({ _id, host, services }) => (
                        <tr key={_id}>
                            <td><Link to={`/allMovieNights/${host}`}>{host}</Link></td>
                            <td>{services}</td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

StreamingServices.propTypes = {
    getUserDetails: PropTypes.func.isRequired, 
    userDetail: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    userDetail: state.userDetail
})

export default connect(mapStateToProps, { getUserDetails })(StreamingServices);