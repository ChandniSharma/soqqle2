import {Map} from 'immutable';
import * as axios from 'axios';
import {API_BASE_URL} from '../config';
import {Effects, loop} from 'redux-loop-symbol-ponyfill';
import * as AppStateActions from './AppReducer';
import store from '../redux/store';

const REGISTER_REQUESTED = 'UserState/REGISTER_REQUESTED';
const REGISTER_COMPLETED = 'UserState/REGISTER_COMPLETED';
const REGISTER_FAILED = 'UserState/REGISTER_FAILED';

const LOGIN_REQUESTED = 'UserState/LOGIN_REQUESTED';
const FACEBOOK_LOGIN_REQUESTED = 'UserState/FACEBOOK_LOGIN_REQUESTED';
const LINKEDIN_LOGIN_REQUESTED = 'UserState/LINKEDIN_LOGIN_REQUESTED';
const LOGIN_COMPLETED = 'UserState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'UserState/LOGIN_FAILED';
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {'Content-type': 'application/json'}
});
// Initial state
const initialState = Map({isLoading: false, user: {}, error: {}});

export function loginRequest(data) {
  return {
    type: LOGIN_REQUESTED,
    payload: data
  };
}

export function facebookLoginRequest(facebookId) {
  return {
    type: FACEBOOK_LOGIN_REQUESTED,
    payload: facebookId
  };
}

export function linkedinLoginRequest(linkedinId) {
  return {
    type: LINKEDIN_LOGIN_REQUESTED,
    payload: linkedinId
  };
}

export function loginCompleted(data) {
  return {
    type: LOGIN_COMPLETED,
    payload: data
  };
}

export function loginFailed(error) {
  return {
    type: LOGIN_FAILED,
    payload: error
  };
}

export async function login(data) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/auth/sign-in', data);
    console.log("response=>", response)
    store.dispatch(AppStateActions.stopLoading());
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return loginCompleted(response.data);
  } catch (error) {
    console.log("error=>", error.response)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return loginFailed({code: error.response.status, message:  "Login failed ! Please check your email and password"});
    }
    return loginFailed({code: 500, message: 'Unexpected error!'});
  }
}

export async function facebookLogin(profile) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post(`/mobile/facebook-login`, profile);
    store.dispatch(AppStateActions.stopLoading());
    if (!response.data) {
      return loginFailed({code: 404, message: 'No Soqqle account associated with your logged Facebook account'});
    }
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return loginCompleted(response.data);
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return loginFailed(error.response.data);
    }
    return loginFailed({code: 500, message: 'Unexpected error!'});
  }
}

export async function linkedinLogin(profile) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post(`/mobile/linkedin-login`, profile);
    store.dispatch(AppStateActions.stopLoading());
    if (!response.data) {
      return loginFailed({code: 404, message: 'No Soqqle account associated with your logged LinkedIn account'});
    }
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return loginCompleted(response.data);
  } catch (error) {
    console.log("====error====", error)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return loginFailed(error.response.data);
    }
    return loginFailed({code: 500, message: 'Unexpected error!'});
  }
}


export function registerRequest(data) {
  return {
    type: REGISTER_REQUESTED,
    payload: data
  };
}

export function registerCompleted(data) {
  return {
    type: REGISTER_COMPLETED,
    payload: data
  };
}

export function registerFailed(error) {
  return {
    type: REGISTER_FAILED,
    payload: error
  };
}

export async function register(data) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/user/register', data);
    console.log("response=>", response)
    store.dispatch(AppStateActions.stopLoading());
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return registerCompleted(response.data);
  } catch (error) {
    console.log("error=>", error)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return registerFailed(error.response.data);
    }
    return registerFailed({code: 500, message: 'Unexpected error!'});
  }
}

// Reducer
export default function UserStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case REGISTER_REQUESTED:
      return loop(
        state.set('error', null).set('registerSuccess', false).set('loginSuccess', false),
        Effects.promise(register, action.payload)
      );
    case REGISTER_COMPLETED:
      return state.set('user', action.payload).set('registerSuccess', true);
    case REGISTER_FAILED:
      return state.set('error', action.payload).set('registerSuccess', false);
    case LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(login, action.payload)
      );
    case FACEBOOK_LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(facebookLogin, action.payload)
      );
    case LINKEDIN_LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(linkedinLogin, action.payload)
      );
    case LOGIN_COMPLETED:
      return state.set('user', action.payload).set('loginSuccess', true);
    case LOGIN_FAILED:
      return state.set('error', action.payload).set('loginSuccess', false);
    default:
      return state;
  }
}
