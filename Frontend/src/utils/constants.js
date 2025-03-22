export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE = `${AUTH_ROUTES}/add-profile`;
export const REMOVE_PROFILE = `${AUTH_ROUTES}/remove-profile-img`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTES = "contact";
export const CONTACT_SEARCH = `${CONTACT_ROUTES}/search`;
export const CONTACT_DM = `${CONTACT_ROUTES}/getContacts`;
export const ALLCONTACTS = `${CONTACT_ROUTES}/getallContacts`;

export const MESSAGE_ROUTES = "message";
export const MESSAGE_DATA = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE = `${MESSAGE_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = "channel";
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/channel`;
export const USERS_CHANNEL = `${CHANNEL_ROUTES}/user-channels`;
export const CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;