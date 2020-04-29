import axios from 'axios';
import { 
    GET_RELEASENOTES,
    GET_ERRORS,
    RELEASENOTES_LOADING
} from './types';

// get all release notes
export const getReleaseNotes = () => dispatch => {
    dispatch(setReleaseNotesLoading());
    axios
        .get('/api/releaseNotes')
        .then(res => 
            dispatch({
                type: GET_RELEASENOTES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
              type: GET_RELEASENOTES,
              payload: null
            })
          );
};

// Get movie night by date
export const getReleaseNotesByDate = date => dispatch => {
    dispatch(setReleaseNotesLoading());
    axios
      .get(`/api/releaseNotes/date/${date}`)
      .then(res =>
        dispatch({
          type: GET_RELEASENOTES,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err
          })
        );
  };

export const setReleaseNotesLoading = () => {
    return {
        type: RELEASENOTES_LOADING
    }
};