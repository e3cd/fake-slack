import React from "react";

const FirebaseContext = React.createContext({
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
});

export default FirebaseContext;
