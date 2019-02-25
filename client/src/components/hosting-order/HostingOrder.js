import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getHostingOrders } from '../../actions/hostingOrderActions';
import PropTypes from 'prop-types';

class HostingOrder extends Component {
    componentDidMount() {
        this.props.getHostingOrders();
    }

    render() {
        const { hostingOrders } = this.props.hostingOrder;
        return(
            <Container>                
                <ListGroup>
                    {hostingOrders.map(({ _id, host, order }) => (
                        <ListGroupItem key={_id}>
                            {host} {order}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Container>
        );
    }
}

HostingOrder.propTypes = {
    getHostingOrders: PropTypes.func.isRequired, 
    hostingOrder: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    hostingOrder: state.hostingOrder
})

export default connect(mapStateToProps, { getHostingOrders })(HostingOrder);