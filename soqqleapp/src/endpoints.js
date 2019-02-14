import {API_BASE_URL} from './config';
export const STORIES_LIST_API = `${API_BASE_URL}/storiesGetAll`;
export const STORY_HAS_VIDEO_API = `${API_BASE_URL}/story/{}/has-video`;
export const AGENDA_LIST_API = `${API_BASE_URL}/taskgroupGetAll?page={}`;
export const USER_TASK_GROUP_LIST_API = `${API_BASE_URL}/userTaskGroup?page={page}&type={type}`;
export const SAVE_USER_TASK_GROUP_API = `${API_BASE_URL}/saveTaskGroup`;
export const USER_TASK_GROUP_LIST_PATH_API = `userTaskGroup?page={page}&type={type}`;
export const TEAM_UPDATE_API = `${API_BASE_URL}/team/{}/`;
export const ACHIEVEMENT_LIST_PATH_API = `/achievement/group/`;
export const USER_ACHIEVEMENT_LIST_PATH_API = `/userAchievement/{}/`;
export const USER_SPARK_LIST_PATH_API = `/userAccounting?id={}`;
export const SAVE_ANSWERS_PATH_API = `/hangoutAnswersSave`;
export const SAVE_TASK_PATH_API = `/taskSavePost`;
export const UPDATE_USER_TASK_GROUP_API_PATH = `/taskGroup/{}`;
export const GET_OBJECTIVE_API_PATH = `/taskRefs/{}`;
export const MAKE_GROUP_PUBLIC_API = `/updateGroupStatusPublic/{}`;
export const MAKE_GROUP_PRIVATE_API = `/updateGroupStatusPrivate/{}`;
export const GET_MESSAGE_LIST_API = `/fetchConversationByParticipants?chatType=GROUP&ids={team_id}`;
export const CHAT_SOCKET_URL = API_BASE_URL;
export const STORY_CHALLENGES_LIST_API_PATH = `/challengeStory`;
export const GET_TASK_GROUPS_API = `/taskgroupGetAll`;
