import React, { useState, useContext, useEffect } from "react";
import FirebaseContext from "./../../firebase/context";
import useInputState from "./../hooks/useInputState";
import useToggle from "./../hooks/useToggle";
// import FileUpload from "./FileUpload";
import uuidv4 from "uuid/v4";
import FileUploader from "react-firebase-file-uploader";

import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";

import {
  Paper,
  InputBase,
  Divider,
  IconButton,
  Icon,
  Button,
  LinearProgress
} from "@material-ui/core";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: "1rem",
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
  button: {
    margin: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  fileInput: {
    display: "none"
  }
}));

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: "#f7f7f7"
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#1d428a"
  }
})(LinearProgress);

function MessagesForm() {
  const { user, state, firebase } = useContext(FirebaseContext);

  const [message, updateMessage, resetMessage] = useInputState("");
  //   const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useToggle(false);
  const [progress, setProgress] = useState(0);

  /**
   *
   *  Firebase Constants
   *
   */
  const privateMessagesRef = firebase.db.ref("privateMessages");
  const messagesRef = firebase.db.ref("messages");
  const typingRef = firebase.db.ref("typing");
  const storageRef = firebase.storage.ref();

  /**
   *
   * Functions
   *
   */

  function handleKeyDown(event) {
    //ctrl and enter button are pressed
    if (event.keyCode === 13) {
      sendMessage();
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

  function handleUploadStart() {
    setUploading();
    setProgress(0);
  }

  function handleUploadError(error) {
    setUploading(false);
    console.error(error);
  }

  function handleProgress(progress) {
    setProgress(progress);
  }

  function getPath() {
    if (state.isPrivateChannel) {
      return `/chat/private/${state.currentChannel.id}`;
    } else {
      return `/chat/public`;
    }
  }

  function handleUploadSuccess(filename) {
    // const storageRef = firebase.storage.ref();
    const path = `${getPath()}/${uuidv4()}.jpg`;
    const pathToUpload = state.currentChannel.id;
    console.log(pathToUpload);

    setProgress(100);
    setUploading(false);
    storageRef
      .child(filename)
      .getDownloadURL()
      .then(downloadUrl => {
        sendFileMessage(downloadUrl, messagesRef, pathToUpload);
      })
      .catch(error => {
        console.error(error);
        setErrors(error);
      });
    console.log(storageRef.child(path));
  }

  function sendFileMessage(downloadUrl, messagesRef, pathToUpload) {
    console.log(pathToUpload);
    messagesRef
      .child(pathToUpload)
      .push()
      .set(createMessage(downloadUrl))
      .then(setProgress(0))
      .catch(error => {
        console.error(error);
        setErrors(error);
      });
  }

  //   handleUploadSuccess = filename => {
  //     this.setState({ avatar: filename, progress: 100, isUploading: false });
  //     firebase
  //       .storage()
  //       .ref("images")
  //       `${getPath()}/${uuidv4()}.jpg`
  //       .child(getPath())
  //       .getDownloadURL()

  //   };

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

  const classes = useStyles();
  return (
    <div>
      <BorderLinearProgress
        variant="determinate"
        color="primary"
        value={progress}
      />

      <Paper className={classes.root}>
        <InputBase
          onKeyDown={handleKeyDown}
          value={message}
          onChange={updateMessage}
          className={classes.input}
          placeholder="Message..."
          inputProps={{ "aria-label": "Message..." }}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={sendMessage}
          disabled={loading}
        >
          Send
          {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
          <Icon className={classes.rightIcon}>send</Icon>
        </Button>

        <Divider className={classes.divider} />

        <FileUploader
          accept="image/*"
          id="contained-button-file"
          name="image"
          randomizeFilename
          storageRef={storageRef}
          onUploadStart={handleUploadStart}
          onUploadError={handleUploadError}
          onUploadSuccess={handleUploadSuccess}
          onProgress={handleProgress}
          style={{ display: "none" }}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="secondary"
            component="span"
            className={classes.button}
          >
            Upload
            <CloudUploadIcon className={classes.rightIcon} />
          </Button>
        </label>
      </Paper>
    </div>
  );
}

export default MessagesForm;
