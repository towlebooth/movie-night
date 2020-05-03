import axios from 'axios';
import { 
    GET_USER_DETAILS, 
    USER_DETAILS_LOADING, 
    GET_ERRORS
} from './types';

// NOTE: for authorization stuff that also uses User, see authActions

export const getUserDetails = () => dispatch => {
    dispatch(setUsersLoading());
    //console.log('made it to User actions');
    axios
        .get('/api/userDetails/')
        .then(res =>             
            dispatch({
                type: GET_USER_DETAILS,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
              type: GET_ERRORS,
              payload: null
            })
          );
};

export const setUsersLoading = () => {
    return {
        type: USER_DETAILS_LOADING
    }
};