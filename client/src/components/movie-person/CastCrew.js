import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPersonFromApiByTmdbId } from '../../actions/personActions';
import PersonDetail from './../movie-person/PersonDetail';


class CastCrew extends Component {
  componentDidMount() {  
      this.props.getPersonFromApiByTmdbId(this.props.match.params.personTmdbId);
  }

  render() {
    
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PersonDetail tmdbId={this.props.match.params.personTmdbId}></PersonDetail>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CastCrew.propTypes = {
    getPersonFromApiByTmdbId: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    person: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    person: state.person,
    auth: state.auth
});

export default connect(mapStateToProps, { getPersonFromApiByTmdbId })(CastCrew);
