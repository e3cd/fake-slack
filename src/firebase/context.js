import React from "react";

const FirebaseContext = React.createContext({
  currentChannel: {},
  isPrivateChannel: false,
  directMessagesUsers: [],
  userPosts: null
});

export default FirebaseContext;
