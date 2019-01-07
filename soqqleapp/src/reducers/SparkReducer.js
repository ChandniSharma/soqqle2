import { Map } from 'immutable';
import * as axios from 'axios';
import { API_BASE_URL } from '../config';
import { Effects, loop } from 'redux-loop-symbol-ponyfill';
import * as AppStateActions from './AppReducer';
import store from '../redux/store';

const GET_SPARKS_REQUESTED = 'sparksState/GET_SPARKS_REQUESTED';
const GET_SPARKS_COMPLETED = 'sparksState/GET_SPARKS_COMPLETED';
const GET_SPARKS_FAILED = 'sparksState/GET_SPARKS_FAILED';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});

// Initial state
const initialState = Map({ isLoading: false, details: [], error: {} });


export function getSparksRequest(data) {
  return {
    type: GET_SPARKS_REQUESTED,
    payload: data
  };
}

export function getSparksCompleted(data) {
  return {
    type: GET_SPARKS_COMPLETED,
    payload: data
  };
}

export function getSparksFailed(error) {
  return {
    type: GET_SPARKS_FAILED,
    payload: error
  };
}

export async function getSparks(data) {
  try {
    if (data.initialLoad) {
      store.dispatch(AppStateActions.startLoading());
    }
    const response = await instance.get(data.endpoint);
    store.dispatch(AppStateActions.stopLoading());
    return getSparksCompleted(response.data.userTransactions);
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return getSparksFailed(error.response.data);
    }
    return getSparksFailed({ code: 500, message: 'Unexpected error!' });
  }
}

// Reducer
export default function sparkStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_SPARKS_REQUESTED:
      return loop(
        state.set('error', null).set('getSparksSuccess', false),
        Effects.promise(getSparks, action.payload)
      );
    case GET_SPARKS_COMPLETED:
      return state.set('details', action.payload).set('getSparksSuccess', true);
    case GET_SPARKS_FAILED:
      return state.set('error', action.payload).set('getSparksSuccess', false);
    default:
      return state;
  }
}
