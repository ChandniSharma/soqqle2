import { Map } from 'immutable';
import * as axios from 'axios';
import { API_BASE_URL } from '../config';
import * as AppStateActions from './AppReducer';
import store from '../redux/store';

const GET_USER_TASKS_REQUESTED = 'UserTasksState/GET_USER_TASKS_REQUESTED';
const GET_USER_TASKS_COMPLETED = 'UserTasksState/GET_USER_TASKS_COMPLETED';
const GET_USER_TASKS_FAILED = 'UserTasksState/GET_USER_TASKS_FAILED';

const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 25000,
    headers: { 'Content-type': 'application/json' }
});

// Initial state
const initialState = Map({ isLoading: false, details: {}, error: {} });


export const getUserTasksRequest = (data) => {
    return {
        type: GET_USER_TASKS_REQUESTED,
        payload: data
    };
}

export const getUserTasksCompleted = (data) => {
    return {
        type: GET_USER_TASKS_COMPLETED,
        payload: data
    };
}

export const getUserTasksFailed = (error) => {
    return {
        type: GET_USER_TASKS_FAILED,
        payload: error
    };
}

export async const getUserTasks = (page) => {
    let endpoint = 'userTaskGroup?page={page}&type=Story'.replace('{}', page);
    try {
        store.dispatch(AppStateActions.startLoading());
        const response = await instance.get(endpoint);
        console.log(response);
        store.dispatch(AppStateActions.stopLoading());
        store.dispatch(AppStateActions.loginSuccess(response.data));
        return getUserTasksCompleted(response.data);
    } catch (error) {
        store.dispatch(AppStateActions.stopLoading());
        if (error.response && error.response.data) {
            return getUserTasksFailed(error.response.data);
        }
        return getUserTasksFailed({ code: 500, message: 'Unexpected error!' });
    }
}

// Reducer
export default CompanyStateReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case GET_USER_TASKS_REQUESTED:
            return { ...initialState, ...({ data: action.payload, error: null }) }
        case GET_USER_TASKS_COMPLETED:
            return { ...initialState, ...({ data: action.payload }) }
        case GET_USER_TASKS_FAILED:
            return { ...initialState, ...({ error: action.payload, data: null }) }
        default:
            return state;
    }
}
