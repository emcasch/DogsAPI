import axios from 'axios';
import { GET_DOGS, DOG_DETAIL } from './action-types';

export const getDogs = () => {
    return async function(dispatch){
        try {
            let response = await axios.get('URL');
            return dispatch({type: GET_DOGS, payload: response.data});
        } catch (error) {
            console.log(error);
        }
    };
};