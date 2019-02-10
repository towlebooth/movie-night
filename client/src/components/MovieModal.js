import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { createMovie } from '../actions/movieActions';

class MovieModal extends Component {
    state = {
        modal: false,
        name: ''
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();

        const newMovie = {
            title: this.state.name,
            releaseDate: this.state.releaseDate
        }

        // add movie via createMovie action
        this.props.createMovie(newMovie);

        // close modal
        this.toggle();
    }

    //handleClick () {
    //    axios.get('http://www.omdbapi.com/?i=tt3896198&apikey=3ff32cc3')
     //     .then(response => console.log(response))
    //}

    render() {

        return(
            <div>
                <Button
                    color="dark"
                    style={{marginBottom: '2rem'}}
                    onClick={this.toggle}
                >Add Movie</Button>

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader toggle={this.toggle}>Add to Shopping List</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="movie">Movie</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="movie"
                                    placeholder="Add movie"
                                    onChange={this.onChange}
                                ></Input>
                                
                                <Button
                                    color="dark"
                                    style={{marginTop: '2rem'}}
                                    block
                                >Add Movie                                    
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    movie: state.movie
});

export default connect(mapStateToProps, { createMovie })(MovieModal);