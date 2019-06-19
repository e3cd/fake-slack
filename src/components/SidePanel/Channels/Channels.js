import React, { useState, useContext, useEffect } from "react";
import FirebaseContext from "./../../../firebase/context";
import useFormValidation from "./../../hooks/useFormValidation";
import validateAddChannel from "./validateAddChanel";

import {
  Avatar,
  ListItemAvatar,
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
  Button,
  Badge,
  Typography
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
    backgroundColor: "#00b8d4"
  },
  item: {
    display: "flex",
    justifyContent: "space-between"
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
  const [notifications, setNotifications] = useState([]);

  const channelsRef = firebase.db.ref("channels");
  const messagesRef = firebase.db.ref("messages");

  useEffect(() => {
    setFirstChannel();
  }, []);

  useEffect(() => {
    setChannel([]);

    channelListeners();
    return () => {};
  }, [channels.length, notifications.length]);

  // useEffect(() => {
  //   setFirstChannel();
  // }, [channels.length]);

  // useEffect(() => {
  //   channelListeners();
  // }, [channels.length]);

  // useEffect(() => {
  //   channelListeners();
  // }, [notifications.length]);

  function channelListeners() {
    let loadedChannels = [];
    channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      setChannels([...loadedChannels]);
      addNotificationListener(snap.key);
    });
  }

  //remove listeners when navigating to different route, use firebase method off
  function removeListeners() {
    channelsRef.off();
    channels.forEach(channel => {
      messagesRef.child(channel.id).off();
    });
  }

  function addNotificationListener(channelId) {
    //put channel id as child on messages ref, listen to value changes -- any new messages added to any channels

    messagesRef.child(channelId).on("value", snap => {
      if (channel) {
        handleNotifications(channelId, channel.id, notifications, snap);
      }
    });
  }

  //show number of mesages that are new and other channels that theyre not on
  function handleNotifications(
    channelId,
    currentChannelId,
    notifications,
    snap
  ) {
    let lastTotal = 0;
    //use findindex to iterate over the notifications state, find notification id that matches with channel id
    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    //
    if (index !== -1) {
      //make sure that notification is for a channel other than current channel
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        //most recent number of notifications, if there is a new message/multiple messages added ,update count with snap.numchildren() - lastTOtal

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      //update last known total
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }
    setNotifications(notifications);
  }

  function clearNotifications() {
    let index = notifications.findIndex(
      notification => notification.id === channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;

      setNotifications(updatedNotifications);
    }
  }

  function getNotificationCount(channel) {
    let count = 0;

    notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
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
            className={classes.item}
          >
            #{channel.name}
            {getNotificationCount(channel) && (
              <Badge
                color="secondary"
                badgeContent={getNotificationCount(channel)}
              />
            )}
          </ListItem>
        </List>
      ))
    );
  }

  function setFirstChannel() {
    let firstChannel = channels[0];
    if (channels.length > 0) {
      setActiveChannel(firstChannel.id);
      setChannel(firstChannel);
    }
    // dispatch({
    //   type: "SET_CURRENT_CHANNEL",
    //   payload: firstChannel
    // });
  }

  function changeChannel(channel) {
    setActiveChannel(channel.id);
    clearNotifications();
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

  // console.log(state);
  // console.log(notifications);
  // // console.log(notifications);
  // console.log(getNotificationCount(channel));
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
              <Typography>CHANNELS</Typography>
              <Typography style={{ marginLeft: "0.5rem" }}>
                ({channels.length})
              </Typography>
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
