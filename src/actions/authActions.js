import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, LOGIN_FAIL } from './types';
import { setAlert } from './alertActions';

export const register = ({ username, email, password }, navigate, csrfToken) => async (dispatch) => {
    try {
        const res = await axios.post('http://localhost:8080/api/user/register', { username, email, password }, {
            headers: {
                'CSRF-Token': csrfToken
            }
        });
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data.token,
        });
        dispatch(setAlert('Registration successful', 'success'));
        navigate('/');
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL,
        });
        dispatch(setAlert(err.response.data.error, 'danger'));
    }
};

export const login = ({ email, password }, navigate, csrfToken) => async (dispatch) => {
    try {
        const res = await axios.post('http://localhost:8080/api/user/login', { email, password }, {
            headers: {
                'CSRF-Token': csrfToken
            }
        });
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data.token,
        });
        dispatch(setAlert('Login successful', 'success'));
        navigate('/');
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL,
        });
        dispatch(setAlert(err.response.data.error, 'danger'));
    }
};