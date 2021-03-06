import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../actions/profileActions';
import { Container } from 'reactstrap';
import HostingOrder from '../hosting-order/HostingOrder';
import StreamingServices from '../streaming-services/StreamingServices';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {

    let dashboardContent;

    dashboardContent = 
      <Container>
        <HostingOrder />
        <br /><br />
        <StreamingServices />
      </Container>;

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
