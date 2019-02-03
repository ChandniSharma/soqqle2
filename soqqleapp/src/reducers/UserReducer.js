import {Map} from 'immutable';
import * as axios from 'axios';
import {API_BASE_URL} from '../config';
import {USER_TASK_GROUP_LIST_PATH_API, GET_MESSAGE_LIST_API} from './../endpoints';
import {Effects, loop} from 'redux-loop-symbol-ponyfill';
import * as SessionStateActions from '../session/SessionState';
import * as AppStateActions from './AppReducer';
import store from '../redux/store';
import * as snapshot from "../utils/snapshot";
import * as constants from '../constants';
import {getGroupUserDetails} from "../utils/common";

const REGISTER_REQUESTED = 'UserState/REGISTER_REQUESTED';
const REGISTER_COMPLETED = 'UserState/REGISTER_COMPLETED';
const REGISTER_FAILED = 'UserState/REGISTER_FAILED';

const CHECK_EMAIL_REQUESTED = 'UserState/CHECK_EMAIL_REQUESTED';
const CHECK_EMAIL_COMPLETED = 'UserState/CHECK_EMAIL_COMPLETED';
const CHECK_EMAIL_FAILED = 'UserState/CHECK_EMAIL_FAILED';

const LOGIN_REQUESTED = 'UserState/LOGIN_REQUESTED';
const FACEBOOK_LOGIN_REQUESTED = 'UserState/FACEBOOK_LOGIN_REQUESTED';
const LINKEDIN_LOGIN_REQUESTED = 'UserState/LINKEDIN_LOGIN_REQUESTED';
const LOGIN_COMPLETED = 'UserState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'UserState/LOGIN_FAILED';

const FORGOT_PASSWORD_REQUESTED = 'UserState/FORGOT_PASSWORD_REQUESTED';
const FORGOT_PASSWORD_COMPLETED = 'UserState/FORGOT_PASSWORD_COMPLETED';
const FORGOT_PASSWORD_FAILED = 'UserState/FORGOT_PASSWORD_FAILED';

const GET_COMPANIES_REQUESTED = 'UserState/GET_COMPANIES_REQUESTED';
const GET_COMPANIES_COMPLETED = 'UserState/GET_COMPANIES_COMPLETED';
const GET_COMPANIES_FAILED = 'UserState/GET_COMPANIES_FAILED';

const SAVE_PROFILE_REQUESTED = 'UserState/SAVE_PROFILE_REQUESTED';
const SAVE_PROFILE_COMPLETED = 'UserState/SAVE_PROFILE_COMPLETED';
const SAVE_PROFILE_FAILED = 'UserState/SAVE_PROFILE_FAILED';

const LOG_OUT = 'UserState/LOG_OUT';
const GET_USER_TASK_GROUPS_REQUESTED = 'UserState/GET_USER_TASK_GROUPS_REQUESTED';
const GET_USER_TASK_GROUPS_COMPLETED = 'UserState/GET_USER_TASK_GROUPS_COMPLETED';
const GET_USER_TASK_GROUPS_FAILED = 'UserState/GET_USER_TASK_GROUPS_FAILED';

const GET_MESSAGELIST_REQUESTED = 'UserState/GET_MESSAGELIST_REQUESTED';
const GET_MESSAGELIST_COMPLETED = 'UserState/GET_MESSAGELIST_COMPLETED';
const GET_MESSAGELIST_FAILED = 'UserState/GET_MESSAGELIST_FAILED';

const BLOCK_USER_REQUESTED = 'UserState/BLOCK_USER_REQUESTED';
const BLOCK_USER_COMPLETED = 'UserState/BLOCK_USER_COMPLETED';
const BLOCK_USER_FAILED = 'UserState/BLOCK_USER_FAILED';

const BLOCK_USER_LIST_REQUESTED = 'UserState/BLOCK_USER_LIST_REQUESTED';
const BLOCK_USER_LIST_COMPLETED = 'UserState/BLOCK_USER_LIST_COMPLETED';
const BLOCK_USER_LIST_FAILED = 'UserState/BLOCK_USER_LIST_FAILED';

const BLOCK_UNBLOCK_USER_COMPLETED = 'UserState/BLOCK_UNBLOCK_USER_COMPLETED';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {'Content-type': 'application/json'}
});
// Initial state
const initialState = Map({isLoading: false, user: {}, error: {}, companies: [], task_groups: {}});

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

export function forgotpasswordRequested(data) {
  return {
    type: FORGOT_PASSWORD_REQUESTED,
    payload: data
  };
}

export function forgotpasswordCompleted(data) {
  return {
    type: FORGOT_PASSWORD_COMPLETED,
    payload: data
  };
}

export function forgotpasswordFailed(error) {
  return {
    type: FORGOT_PASSWORD_FAILED,
    payload: error
  };
}

export function saveProfileRequest(data) {
  return {
    type: SAVE_PROFILE_REQUESTED,
    payload: data
  };
}

export function saveProfileCompleted(data) {
  return {
    type: SAVE_PROFILE_COMPLETED,
    payload: data
  };
}

export function saveProfileFailed(error) {
  return {
    type: SAVE_PROFILE_FAILED,
    payload: error
  };
}
export function blockUserRequested(data) {
  return {
    type: BLOCK_USER_REQUESTED,
    payload: data
  };
}

export function blockUserCompleted(data) {
  return {
    type: BLOCK_USER_COMPLETED,
    payload: data
  };
}

export function blockUserFailed(error) {
  return {
    type: BLOCK_USER_FAILED,
    payload: error
  };
}
export function blockUnlockUserCompleted(data) {
  return {
    type: BLOCK_UNBLOCK_USER_COMPLETED,
    payload: data
  };
}
export function blockUserListRequested(data) {
  return {
    type: BLOCK_USER_LIST_REQUESTED,
    payload: data
  };
}

export function blockUserListCompleted(data) {
  return {
    type: BLOCK_USER_LIST_COMPLETED,
    payload: data
  };
}

export function blockUserListFailed(error) {
  return {
    type: BLOCK_USER_LIST_FAILED,
    payload: error
  };
}
export async function getBlockUserList(data) {
  let postData = {'blockUserIds':data}
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/getBlockedUsers', postData);
    store.dispatch(AppStateActions.stopLoading());
    return blockUserListCompleted(response.data);
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return blockUserListFailed({code: error.response.status, message: "Please try again"});
    }
    return blockUserListFailed({code: 500, message: 'Unexpected error!'});
  }
}
export async function saveProfile(data) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/mobile/user-profile', data);
    store.dispatch(AppStateActions.stopLoading());
    return saveProfileCompleted(response.data);
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return saveProfileFailed({code: error.response.status, message: "Save failed ! Please try again"});
    }
    return saveProfileFailed({code: 500, message: 'Unexpected error!'});
  }
}

export async function forgotPassword(data) {
  let arrayParam = { 'email': data.email, 'password': data.newPassword };
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/auth/forget-password', arrayParam);
    store.dispatch(AppStateActions.stopLoading());
    return forgotpasswordCompleted(response.data);
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return forgotpasswordFailed({
        code: error.response.status,
        message: "Forgot password failed! Please check your email."
      });
    }
    return forgotpasswordFailed({code: 500, message: 'Unexpected error!'});
  }

}

export async function login(data) {

  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/auth/sign-in', data);
    store.dispatch(AppStateActions.stopLoading());
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return loginCompleted(response.data);
  } catch (error) {
    console.log("error=>", error.response);
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return loginFailed({code: error.response.status, message: "Login failed ! Please check your email and password"});
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
    //console.log("error=====", JSON.stringify(error), JSON.stringify(profile))
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
    console.log("====error====", error);
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

export function checkEmailRequest(data) {
  return {
    type: CHECK_EMAIL_REQUESTED,
    payload: data
  };
}

export function checkEmailCompleted(data) {
  return {
    type: CHECK_EMAIL_COMPLETED,
    payload: data
  };
}

export function checkEmailFailed(error) {
  return {
    type: CHECK_EMAIL_FAILED,
    payload: error
  };
}

export async function checkEmail(email) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.get(`/mobile/profile-exist?email=${email}`);
    console.log("response=>", response);
    store.dispatch(AppStateActions.stopLoading());
    return checkEmailCompleted(response.data);
  } catch (error) {
    console.log("error=>", error);
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return checkEmailFailed(error.response.data);
    }
    return registerFailed({code: 500, message: 'Unexpected error!'});
  }
}


export async function register(data) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/user/register', data);
    console.log("response=>", response);
    store.dispatch(AppStateActions.stopLoading());
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return registerCompleted(response.data);
  } catch (error) {
    console.log("error=>", error);
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return registerFailed(error.response.data);
    }
    return registerFailed({code: 500, message: 'Unexpected error!'});
  }
}

export function getCompaniesRequest(email) {
  return {
    type: GET_COMPANIES_REQUESTED,
    payload: email
  };
}

export function getCompaniesCompleted(data) {
  return {
    type: GET_COMPANIES_COMPLETED,
    payload: data
  };
}

export function getCompaniesFailed(error) {
  return {
    type: GET_COMPANIES_FAILED,
    payload: error
  };
}


export async function getCompanies(email) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.get(`/company?email=${email}`);
    console.log("response companies=>", response);
    store.dispatch(AppStateActions.stopLoading());
    return getCompaniesCompleted(response.data);
  } catch (error) {
    console.log("error=>", error);
    if (error.response && error.response.data) {
      return getCompaniesFailed(error.response.data);
    }
    return getCompaniesFailed({code: 500, message: 'Unexpected error!'});
  }
}


/**
 * -----------------------
 * USER TASK GROUPS
 * -----------------------
 */

export const getUserTaskGroupsRequest = (data) => {

  return {
    type: GET_USER_TASK_GROUPS_REQUESTED,
    payload: data
  };
};

export const getUserTaskGroupsCompleted = (data) => {
  return {
    type: GET_USER_TASK_GROUPS_COMPLETED,
    payload: data
  };
};

export const getUserTaskGroupsFailed = (error) => {
  return {
    type: GET_USER_TASK_GROUPS_FAILED,
    payload: error
  };
};

export async function getUserTaskGroups(data) {
  let endpoint = USER_TASK_GROUP_LIST_PATH_API.replace('{page}', data.page || 1);
  endpoint = endpoint.replace('{type}', '');
  if(data.user_email) {
    endpoint = endpoint.concat('&user_email=', data.user_email);
  }
  let taskGroups = data.previousData || [];
  try {
    if (data.load) {
      store.dispatch(AppStateActions.startLoading());
    }
    const response = await instance.get(endpoint);
    store.dispatch(AppStateActions.stopLoading());
    if (data.reset) {
      taskGroups = [];
    }
    if (response) {
      const responseData = getGroupUserDetails(response.data);
      const newUserTasks = [...taskGroups, ...responseData.latestUserTaskGroups];
      return getUserTaskGroupsCompleted({
        count: responseData.totalUserTaskGroups,
        taskGroups: newUserTasks,
        page: data.page
      });
    }
  }
  catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return getUserTaskGroupsFailed(error.response.data);
    }
    return getUserTaskGroupsFailed({code: 500, message: 'Unexpected error!'});
  }
}
export async function blockUser(data) {
  let arrayParam = { 'loginUserId': data.loginUserId, 'blockedUserId': data.blockedUserId, 'isBlocked':data.isBlocked };
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/blockUnblockUser', arrayParam);
    store.dispatch(AppStateActions.stopLoading());
    return blockUserCompleted(response.data);
  } catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return blockUserFailed({
        code: error.response.status,
        message: "block user failed! Please check your user."
      });
    }
    return blockUserFailed({code: 500, message: 'Unexpected error!'});
  }

}
export async function logout() {
  await snapshot.clearSnapshot();
  store.dispatch(SessionStateActions.resetSessionStateFromSnapshot());
  return {type: LOG_OUT};
}

// MessageList 
export function getMessageListRequest(teamId) {
  return {
    type: GET_MESSAGELIST_REQUESTED,
    payload: teamId
  };
}

export function getMessageListCompleted(data) {
  return {
    type: GET_MESSAGELIST_COMPLETED,
    payload: data
  };
}

export function getMessageListFailed(error) {
  return {
    type: GET_MESSAGELIST_FAILED,
    payload: error
  };
}

export async function getMessageList(teamId) {
  let endpoint = GET_MESSAGE_LIST_API.replace('{team_id}', ';' + teamId);
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.get(endpoint)
    store.dispatch(AppStateActions.stopLoading());
    return getMessageListCompleted(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      return getMessageListFailed(error.response.data);
    }
    return getMessageListFailed({ code: 500, message: 'Unexpected error!' });
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
    case CHECK_EMAIL_REQUESTED:
      return loop(
        state.set('error', null).set('checkEmailSuccess', false).set('checkEmailResult', null),
        Effects.promise(checkEmail, action.payload)
      );
    case CHECK_EMAIL_COMPLETED:
      return state.set('checkEmailSuccess', true).set('checkEmailResult', action.payload);
    case CHECK_EMAIL_FAILED:
      return state.set('error', action.payload).set('checkEmailSuccess', false).set('checkEmailResult', null);
    case FORGOT_PASSWORD_REQUESTED:
      return loop(
        state.set('error', null).set('forgotpasswordSuccess', false),
        Effects.promise(forgotPassword, action.payload)
      );
    case FORGOT_PASSWORD_COMPLETED:
      return state.set('user', action.payload).set('forgotpasswordSuccess', true);
    case FORGOT_PASSWORD_FAILED:
      return state.set('error', action.payload).set('forgotpasswordSuccess', false);
    case GET_COMPANIES_REQUESTED:
      return loop(
        state.set('error', null).set('getCompaniesSuccess', false),
        Effects.promise(getCompanies, action.payload)
      );
    case GET_COMPANIES_COMPLETED:
      return state.set('companies', action.payload).set('getCompaniesSuccess', true);
    case GET_COMPANIES_FAILED:
      return state.set('error', action.payload).set('getCompaniesSuccess', false);
    case GET_MESSAGELIST_REQUESTED:
      return loop(
        state.set('error', null).set('getMessageListSuccess', false),
        Effects.promise(getMessageList, action.payload)
      );
    case GET_MESSAGELIST_COMPLETED:
      return state.set('messages', action.payload).set('getMessageListSuccess', true);
    case GET_MESSAGELIST_FAILED:
      return state.set('error', action.payload).set('getMessageListSuccess', false);
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
      return state.set('user', action.payload).set('loginSuccess', true).set('task_groups', {}).set('getUserTaskGroups', false);
    case LOGIN_FAILED:
      return state.set('error', action.payload).set('loginSuccess', false);
    case SAVE_PROFILE_REQUESTED:
      const _id = state.getIn(['user', '_id']);
      return loop(
        state.set('error', null).set('saveProfileSuccess', false),
        Effects.promise(saveProfile, {...action.payload, _id})
      );
    case SAVE_PROFILE_COMPLETED:
      return state.set('user', action.payload).set('saveProfileSuccess', true);
    case SAVE_PROFILE_FAILED:
      return state.set('saveProfileSuccess', false);
    case LOG_OUT:
      return state.set('user', {}).set('companies', []).set('task_groups', {}).set('getUserTaskGroups', false);
    case GET_USER_TASK_GROUPS_REQUESTED:
      return loop(
        state.set('error', null).set('getUserTaskGroups', false),
        Effects.promise(getUserTaskGroups, action.payload)
      );
    case GET_USER_TASK_GROUPS_COMPLETED:
      return state.set('task_groups', action.payload).set('getUserTaskGroups', true);
    case GET_USER_TASK_GROUPS_FAILED:
      return state.set('error', action.payload).set('getUserTaskGroups', false);
      case BLOCK_USER_REQUESTED:
      return loop(
        state.set('error', null).set('blockUserSuccess', false),
        Effects.promise(blockUser, action.payload)
      );
    case BLOCK_USER_COMPLETED:
      return state.set('blockUserSuccess', true);
    case BLOCK_USER_FAILED:
      return state.set('error', action.payload).set('blockUserSuccess', false);
    case BLOCK_UNBLOCK_USER_COMPLETED:
      return state.set('user', action.payload);
    case BLOCK_USER_LIST_REQUESTED:
      return loop(
        state.set('error', null).set('blockUserListSuccess', false),
        Effects.promise(getBlockUserList, action.payload)
      );
    case BLOCK_USER_LIST_COMPLETED:
      return state.set('blockUserList', action.payload).set('blockUserListSuccess', true);
    case BLOCK_USER_LIST_FAILED:
      return state.set('error', action.payload).set('blockUserListSuccess', false);
    default:
      return state;
  }
}
