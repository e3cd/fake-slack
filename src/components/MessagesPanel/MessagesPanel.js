import React, { useState, useContext, useEffect, useRef } from "react";
import FirebaseContext from "./../../firebase/context";
import useToggle from "./../hooks/useToggle";
import { Paper } from "@material-ui/core";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";

function MessagesPanel() {
  const { state, currentUser, firebase, dispatch } = useContext(
    FirebaseContext
  );
  const [messages, setMessages] = useState([]);
  const [messagesLoading, toggleMessagesLoading] = useToggle(true);
  const [listeners, setListeners] = useState([]);
  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useToggle();
  const [searchResults, setSearchResults] = useState("");
  const [channelStarred, setChannelStarred] = useState(false);

  /**
   *
   * Firebase Constants
   *
   */

  const privateMessagesRef = firebase.db.ref("privateMessages");
  const messagesRef = firebase.db.ref("messages");
  const usersRef = firebase.db.ref("users");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setNumUniqueUsers("");
    setMessages([]);
    if (state.currentChannel.id && currentUser) {
      removeListeners(listeners);
      addListeners(state.currentChannel.id);
      addUsersStarsListener(state.currentChannel.id, currentUser.uid);
    }
  }, [state.currentChannel.id]);

  useEffect(() => {
    setSearchResults("");
    setSearchTerm("");
  }, [state.currentChannel.id]);
  useEffect(scrollToBottom, [messages]);

  /**
   *
   * Functions
   *
   */

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function getMessagesRef() {
    return state.isPrivateChannel ? privateMessagesRef : messagesRef;
  }

  function addListeners(channelId) {
    addMessagesListener(channelId);
  }

  //remove listeners through via addToListeners helper function by adding them to each listener method with specified args for each type of listener
  function addToListeners(id, ref, event) {
    const index = listeners.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      setListeners([...listeners, newListener]);
    }
  }

  function addUsersStarsListener(channelId, userId) {
    usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          setChannelStarred(prevStarred);
        }
      });
  }

  function removeListeners(listeners) {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  }

  function addMessagesListener(channelId) {
    let loadedMessages = [];
    const ref = getMessagesRef();

    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());

      setMessages([...loadedMessages]);
      dispatch({
        type: "SET_CHANNEL_MESSAGES",
        payload: loadedMessages
      });
      toggleMessagesLoading();
      countUniqueUsers(loadedMessages);
      // //count user posts to show on metapanel
      countUserPosts(loadedMessages);
    });
    addToListeners(channelId, ref, "child_added");
  }

  function countUniqueUsers(messages) {
    const uniqueUsers = messages.reduce((acc, message) => {
      //check to see if acc array has name, push if not
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    //check for 1 user for no plural
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? `s` : ""}`;
    setNumUniqueUsers(numUniqueUsers);
  }

  function countUserPosts(messages) {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        };
      }
      return acc;
    }, {});
    dispatch({
      type: "SET_USER_POSTS",
      payload: userPosts
    });
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setSearchLoading();
    handleSearchMessages();
  }

  function handleSearchMessages() {
    //spread to not mutate messaages state, apply regex globally and case insensitive 'gi'
    const channelMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      //check to see if message has content and not image
      if (message.content && message.content.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setTimeout(() => setSearchLoading(), 1000);
  }

  function handleStar() {
    setChannelStarred(channelStarred === false ? true : false);
  }

  const displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => {
      // console.log(this.state.user);
      return <Message key={message.timestamp} message={message} />;
    });

  return (
    <div>
      <MessagesHeader
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        handleStar={handleStar}
        channelStarred={channelStarred}
      />
      <Paper className="messages__panel">
        {searchTerm
          ? displayMessages(searchResults)
          : displayMessages(messages)}
        <div ref={messagesEndRef} />
      </Paper>

      <MessagesForm getMessagesRef={getMessagesRef} />
    </div>
  );
}

export default MessagesPanel;
