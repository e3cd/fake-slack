import React, { useContext, useState, useEffect } from "react";
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
import {
  Forum as ForumIcon,
  FiberManualRecord as FiberManualRecordIcon
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
    backgroundColor: "#64DD17"
  },
  item: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

function DirectMessages(props) {
  const { currentUser, firebase, state, dispatch } = useContext(
    FirebaseContext
  );
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");
  //   const [firstLoad, setFirstLoad] = useState(true);

  /**
   *
   * Firebase Constants
   *
   */
  const connectedRef = firebase.db.ref(".info/connected");
  const presenceRef = firebase.db.ref("presence");
  const usersRef = firebase.db.ref("users");

  /**
   *
   * Functions
   *
   */

  useEffect(() => {
    addListeners(currentUser.uid);
    return () => {};
  }, [users.length, notifications.length]);

  function addListeners(currentUserUid) {
    let loadedUsers = [];

    usersRef.on("child_added", snap => {
      if (currentUser.uid !== snap.key) {
        //users under usersRef collection
        let newUser = snap.val();
        newUser["uid"] = snap.key;
        newUser["status"] = "offline";
        loadedUsers.push(newUser);
        dispatch({
          type: "SET_DIRECT_MESSAGES_USERS",
          payload: loadedUsers
        });
        setUsers(loadedUsers);
      }
    });
    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserUid);
        ref.set(true); //create new presence ref
        ref.onDisconnect().remove(error => {
          if (error !== null) {
            console.error(error);
          }
        });
      }
    });

    //add new user to presence ref
    presenceRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
  }

  function addStatusToUser(userId, connected = true) {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    dispatch({
      type: "SET_DIRECT_MESSAGES_USERS",
      payload: updatedUsers
    });
    setUsers(updatedUsers);

    // this.setState({ users: updatedUsers });
  }

  function isUserOnline(user) {
    return user.status === "online";
  }

  function changeChannel(user) {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
    dispatch({
      type: "SET_PRIVATE_CHANNEL",
      payload: true
    });
    dispatch({
      type: "SET_CURRENT_CHANNEL",
      payload: channelData
    });
    setActiveChannel(user.uid);
  }

  //make unique channel identifier for every direct messages channel
  function getChannelId(userId) {
    const currentUserId = currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  }

  function displayUsers(users) {
    return (
      users.length > 0 &&
      users.map(user => (
        <List className={classes.root} key={user.uid}>
          <ListItem
            button
            name={user.name}
            onClick={() => changeChannel(user)}
            selected={
              getChannelId(user.uid) === state.currentChannel.id ? true : false
            }
            className={classes.item}
          >
            @{user.name}{" "}
            <FiberManualRecordIcon
              style={{
                color: `${isUserOnline(user) ? "#64DD17" : "#D50000"}`
              }}
            />
          </ListItem>
        </List>
      ))
    );
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
                  <ForumIcon />
                </Avatar>
              </ListItemAvatar>
              <Typography>DIRECT MESSAGES</Typography>
              <Typography style={{ marginLeft: "0.5rem" }}>
                ({users.length})
              </Typography>
            </ListItem>
            {displayUsers(users)}
          </List>
        </div>
      </Grid>
    </>
  );
}

export default DirectMessages;
