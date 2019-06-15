import React, { useState, useContext, useEffect } from "react";
import FirebaseContext from "./../../../firebase/context";
import useFormValidation from "./../../hooks/useFormValidation";
import validateAddChannel from "./validateAddChanel";

import {
  Avatar,
  ListItemAvatar,
  Typography,
  Grid,
  List,
  ListItem,
  makeStyles,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";
// import { deepBlue } from "@material-ui/core/colors";
import {
  List as ListIcon,
  Add as AddIcon,
  ListItem as ListItemIcon
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgb(4, 155, 229)",
    color: "#eee",
    padding: "0"
  },
  title: {
    margin: theme.spacing(4, 0, 2)
  },
  avatar: {
    color: "#fff",
    backgroundColor: "#F9A825"
  }
}));

const INITIAL_STATE = {
  channelName: "",
  channelDetails: ""
};

function Channels() {
  const { currentUser, firebase, state, dispatch } = useContext(
    FirebaseContext
  );
  const { handleSubmit, handleChange, values, errors } = useFormValidation(
    INITIAL_STATE,
    validateAddChannel,
    addChannel
  );

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState(null);
  const [activeChannel, setActiveChannel] = useState("");
  const [channels, setChannels] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);

  const channelsRef = firebase.db.ref("channels");

  useEffect(() => {
    channelListeners();
    return () => {};
  }, []);

  useEffect(() => {
    setFirstChannel();
    return () => {};
  }, [channels]);

  function channelListeners() {
    let loadedChannels = [];
    channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      setChannels([...loadedChannels]);
    });
  }

  function handleClickOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  async function addChannel() {
    // generate unique id through push method which generates key for unique id for each channel
    const key = channelsRef.push().key;

    // create new channel field
    const newChannel = {
      id: key,
      name: values.channelName,
      details: values.channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    try {
      await channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
          console.log("channel saved");

          handleClose();
        });
    } catch (error) {
      console.error(error);
    }
  }

  function displayChannels(channels) {
    return (
      channels.length > 0 &&
      channels.map(channel => (
        <List className={classes.root} key={channel.id}>
          <ListItem
            button
            name={channel.name}
            onClick={() => changeChannel(channel)}
            selected={channel.id === state.currentChannel.id ? true : false}
          >
            #{channel.name}
          </ListItem>
        </List>
      ))
    );
  }

  function setFirstChannel() {
    let firstChannel = channels[0];
    if (channels.length > 0) {
      dispatch({
        type: "SET_CURRENT_CHANNEL",
        payload: firstChannel
      });
      setActiveChannel(firstChannel.id);
      setChannel(channel);
    }
  }

  function changeChannel(channel) {
    setActiveChannel(channel.id);
    dispatch({
      type: "SET_PRIVATE_CHANNEL",
      payload: false
    });
    dispatch({
      type: "SET_CURRENT_CHANNEL",
      payload: channel
    });
    setChannel(channel);
  }

  return (
    <>
      <Grid item xs={12}>
        <div>
          <List dense={true} className={classes.root}>
            <ListItem style={{ marginBottom: "1rem" }}>
              <ListItemAvatar style={{ color: "rgb(24, 118, 210)" }}>
                <Avatar className={classes.avatar}>
                  <ListIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="CHANNELS" />(
              <ListItemText
                style={{ textAlign: "center" }}
                primary={channels.length}
              />
              )
              <ListItemSecondaryAction onClick={handleClickOpen}>
                <IconButton
                  edge="end"
                  aria-label="Delete"
                  style={{ color: "#eee" }}
                >
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {displayChannels(channels)}
          </List>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Channel</DialogTitle>

          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                z
                id="name"
                label="Name of Channel"
                type="text"
                autoComplete="off"
                fullWidth
                label={
                  errors.channelName ? errors.channelName : "Name of Channel"
                }
                error={errors.channelName ? true : false}
                name="channelName"
                onChange={handleChange}
                values={values.channelName}
              />
              <TextField
                margin="dense"
                id="name"
                autoComplete="off"
                label="Details of the Channel"
                type="text"
                name="channelDetails"
                fullWidth
                label={
                  errors.channelDetails
                    ? errors.channelDetails
                    : "Channel Details"
                }
                error={errors.channelDetails ? true : false}
                onChange={handleChange}
                values={values.channelDetails}
              />
            </DialogContent>

            <DialogActions>
              <Button type="submit" color="primary" onClick={changeChannel}>
                Add
              </Button>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Grid>
    </>
  );
}

export default Channels;
