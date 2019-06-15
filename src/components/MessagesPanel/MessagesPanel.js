import React, { useState, useContext, useEffect, useRef } from "react";
import FirebaseContext from "./../../firebase/context";
import useToggle from "./../hooks/useToggle";
import { Paper } from "@material-ui/core";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";

function MessagesPanel() {
  const { state, currentUser, firebase } = useContext(FirebaseContext);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, toggleMessagesLoading] = useToggle(true);
  const [listeners, setListeners] = useState([]);
  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useToggle(false);
  const [searchResults, setSearchResults] = useState("");

  const privateMessagesRef = firebase.db.ref("privateMessages");
  const messagesRef = firebase.db.ref("messages");
  const typingRef = firebase.db.ref("typing");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);

    if (state.currentChannel.id && currentUser) {
      removeListeners(listeners);
      addListeners(state.currentChannel.id);
    }
    setNumUniqueUsers("");
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

  function countUserPosts(messages) {}

  // function displayMessages(messages) {
  //   messages.length > 0 &&
  //     messages.map(message => (
  //       <Message key={message.timestamp} message={message} />
  //     ));
  // }

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
