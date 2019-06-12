import React, { useState, useContext, useEffect } from "react";
import FirebaseContext from "./../../firebase/context";
import useInputState from "./../hooks/useInputState";

import { makeStyles } from "@material-ui/core/styles";
import {
  Send as SendIcon,
  CloudUpload as CloudUploadIcon
} from "@material-ui/icons";

import { Paper, InputBase, Divider, IconButton } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginTop: "2rem",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
});

function MessagesForm() {
  const { user, state, firebase } = useContext(FirebaseContext);

  const [message, updateMessage, resetMessage] = useInputState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const privateMessagesRef = firebase.db.ref("privateMessages");
  const messagesRef = firebase.db.ref("messages");
  const typingRef = firebase.db.ref("typing");

  const classes = useStyles();

  function handleKeyDown(event) {
    //ctrl and enter button are pressed
    if (event.keyCode === 13) {
      sendMessage();

      console.log("pressed");
    }

    if (message) {
      typingRef
        .child(state.currentChannel.id)
        .child(user.uid)
        .set(user.displayName);
    } else {
      typingRef
        .child(state.currentChannel.id)
        .child(user.uid)
        .remove();
    }
  }

  function getMessagesRef() {
    return state.isPrivateChannel ? privateMessagesRef : messagesRef;
  }

  function createMessage(fileUrl = null) {
    const sentMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    };
    if (fileUrl !== null) {
      sentMessage["image"] = fileUrl;
    } else {
      sentMessage["content"] = message;
    }
    console.log(message);
    return sentMessage;
  }

  async function sendMessage() {
    if (message) {
      setLoading(true);
      try {
        await getMessagesRef()
          .child(state.currentChannel.id)
          .push()
          .set(createMessage())
          .then(() => {
            console.log("message sent");
            setLoading(false);
            resetMessage();
            setErrors([]);
          });
        typingRef
          .child(state.currentChannel.id)
          .child(user.uid)
          .remove();
      } catch (error) {
        console.error(error);
        setLoading(false);
        setErrors(error);
      }
    } else {
      setErrors({ message: "Add a message" });
    }
  }

  console.log(message);

  return (
    <Paper className={classes.root}>
      <InputBase
        onKeyDown={handleKeyDown}
        value={message}
        onChange={updateMessage}
        className={classes.input}
        placeholder="Message..."
        inputProps={{ "aria-label": "Message..." }}
      />
      <IconButton
        color="primary"
        className={classes.iconButton}
        aria-label="Search"
        onClick={sendMessage}
      >
        <SendIcon />
      </IconButton>
      <Divider className={classes.divider} />
      <IconButton
        color="secondary"
        className={classes.iconButton}
        aria-label="Directions"
      >
        <CloudUploadIcon />
      </IconButton>
    </Paper>
  );
}

export default MessagesForm;
