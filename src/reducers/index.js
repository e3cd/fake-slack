import {
  SET_CURRENT_CHANNEL,
  SET_PRIVATE_CHANNEL,
  SET_USER_POSTS,
  SET_DIRECT_MESSAGES_USERS,
  SET_CHANNEL_MESSAGES,
  SET_STARRED_CHANNEL
} from "./../actions/types";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return { ...state, currentChannel: action.payload };
    case SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload
      };
    case SET_DIRECT_MESSAGES_USERS:
      return {
        ...state,
        directMessagesUsers: action.payload
      };
    case SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload
      };
    case SET_CHANNEL_MESSAGES:
      return {
        ...state,
        channelMessages: action.payload
      };

    default:
      return state;
  }
}
