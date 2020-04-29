import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { getReleaseNotes } from '../../actions/releaseNoteActions';
import PropTypes from 'prop-types';

class ReleaseNote extends Component {
    componentDidMount() {
        this.props.getReleaseNotes();
    }

    render() {
        const { releaseNotes } = this.props.releaseNote;
        let releaseNotesForList = [];

        if (releaseNotes) {
            releaseNotes.forEach((note) => { 
                let releaseNote = {};
                releaseNote._id = note._id;
                releaseNote.date = note.date;
                releaseNote.title = note.title;
                releaseNote.notes = note.notes;
                releaseNotesForList.push(releaseNote);
            });
        }
        if(releaseNotesForList.length === 0) {
            return (
                <Container>              
                    <h3 className="display-5 mb-5">No Release Notes Found</h3>                    
                </Container>
            );
        }
        return(
            <Container>              
                <h1 className="display-5 mb-5">Release Notes</h1>
                <Table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {releaseNotesForList.map(({ _id, date, title, notes }) => (
                        <tr key={_id}>                            
                            <td>{moment(date).format('YYYY-MM-DD')}</td>
                            <td>{title}</td>
                            <td>
                                <ul>
                                    {notes.map((note) =>
                                    <li key={note.toString()}>
                                        {note}
                                    </li>
                                    )}
                                </ul>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}   

ReleaseNote.propTypes = {
    getReleaseNotes: PropTypes.func.isRequired,
    releaseNote: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    releaseNote: state.releaseNote
})

export default connect(mapStateToProps, { getReleaseNotes })(ReleaseNote);