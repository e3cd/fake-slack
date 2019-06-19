import React, { useState, useEffect, useContext } from "react";
import FirebaseContext from "./../../../firebase/context";
import {
  Avatar,
  ListItemAvatar,
  Grid,
  List,
  ListItem,
  makeStyles,
  Typography
} from "@material-ui/core";
import { StarRate as StarRateIcon } from "@material-ui/icons";

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
    backgroundColor: "#fbc02d"
  },
  item: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

function Starred() {
  const { state, dispatch, firebase, currentUser } = useContext(
    FirebaseContext
  );
  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");

  const usersRef = firebase.db.ref("users");

  useEffect(() => {
    if (currentUser) {
      addListeners(currentUser.uid);
    }
  }, []);

  function addListeners(userId) {
    usersRef
      .child(userId)
      .child("starred")
      .on("child_added", snap => {
        const starredChannel = { id: snap.key, ...snap.val() };
        setStarredChannels(prevStarredChannels => [
          ...prevStarredChannels,
          starredChannel
        ]);
      });

    usersRef
      .child(userId)
      .child("starred")
      .on("child_removed", snap => {
        const channelToRemove = { id: snap.key, ...snap.val() };
        setStarredChannels(prevStarredChannels =>
          prevStarredChannels.filter(channel => {
            return channel.id !== channelToRemove.id;
          })
        );
      });
  }

  function displayChannels(starredChannels) {
    return (
      starredChannels.length > 0 &&
      starredChannels.map(channel => (
        <List className={classes.root} key={channel.id}>
          <ListItem
            button
            name={channel.name}
            onClick={() => changeChannel(channel)}
            selected={channel.id === state.currentChannel.id ? true : false}
            className={classes.item}
          >
            #{channel.name}
          </ListItem>
        </List>
      ))
    );
  }

  function changeChannel(channel) {
    setActiveChannel(channel.name);

    dispatch({
      type: "SET_PRIVATE_CHANNEL",
      payload: false
    });
    dispatch({
      type: "SET_CURRENT_CHANNEL",
      payload: channel
    });
  }

  const classes = useStyles();

  return (
    <>
      <Grid item xs={12}>
        <div>
          <List dense={true} className={classes.root}>
            <ListItem style={{ marginBottom: "1rem" }}>
              <ListItemAvatar style={{ color: "rgb(24, 118, 210)" }}>
                <Avatar className={classes.avatar}>
                  <StarRateIcon />
                </Avatar>
              </ListItemAvatar>
              <Typography>STARRED </Typography>
              <Typography style={{ marginLeft: "0.5rem" }}>
                ({starredChannels.length})
              </Typography>
            </ListItem>
            {displayChannels(starredChannels)}
          </List>
        </div>
      </Grid>
    </>
  );
}

export default Starred;
