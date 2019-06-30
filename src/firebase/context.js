import React from "react";

const FirebaseContext = React.createContext({
  currentChannel: {},
  isPrivateChannel: false,
  directMessagesUsers: [],
  channelMessages: null,
  userPosts: null
});

export default FirebaseContext;
