import React, { useState, useContext, useEffect } from "react";
import FirebaseContext from "./../../firebase/context";
import useToggle from "./../hooks/useToggle";
import { Paper } from "@material-ui/core";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";

function MessagesPanel() {
  const { state, user, firebase } = useContext(FirebaseContext);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, toggleMessagesLoading] = useToggle(true);
  const [listeners, setListeners] = useState([]);

  useEffect(() => {
    setMessages([]);
    if (state.currentChannel.id && user) {
      removeListeners(listeners);
      addListeners(state.currentChannel.id);
    }
  }, [state.currentChannel.id]);

  const privateMessagesRef = firebase.db.ref("privateMessages");
  const messagesRef = firebase.db.ref("messages");
  const typingRef = firebase.db.ref("typing");

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
      toggleMessagesLoading();
      console.log(messages);
      // this.countUniqueUsers(loadedMessages);
      // //count user posts to show on metapanel
      // this.countUserPosts(loadedMessages);
    });
    addToListeners(channelId, ref, "child_added");
  }

  // function displayMessages(messages) {
  //   messages.length > 0 &&
  //     messages.map(message => (
  //       <Message key={message.timestamp} message={message} />
  //     ));
  // }

  const displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => {
      // console.log(this.state.user);
      return <Message key={message.timestamp} message={message} />;
    });

  // console.log(state.currentChannel.id);
  return (
    <div>
      <MessagesHeader />
      <Paper className="messages__panel">{displayMessages(messages)}</Paper>

      <MessagesForm getMessagesRef={getMessagesRef} />
    </div>
  );
}

export default MessagesPanel;
