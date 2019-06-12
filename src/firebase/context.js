import React from "react";

const FirebaseContext = React.createContext({
  currentChannel: {},
  isPrivateChannel: false,
  userPosts: null
});

export default FirebaseContext;
