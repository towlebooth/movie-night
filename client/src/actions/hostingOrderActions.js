import axios from 'axios';
import { 
    GET_HOSTINGORDERS, 
    HOSTINGORDERS_LOADING, 
    GET_ERRORS
} from './types';

export const getHostingOrders = () => dispatch => {
    dispatch(setHostingOrdersLoading());
    //console.log('made it to HO actions');
    axios
        .get('/api/hostingOrders/')
        .then(res => 
            
            dispatch({
                type: GET_HOSTINGORDERS,
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

export const setHostingOrdersLoading = () => {
    return {
        type: HOSTINGORDERS_LOADING
    }
};