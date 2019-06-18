import React, { useState, useEffect, useContext } from "react";
import FirebaseContext from "./../../../firebase/context";
import {
  Avatar,
  ListItemAvatar,
  Grid,
  List,
  ListItem,
  makeStyles,
  ListItemText
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
  const { state, dispatch } = useContext(FirebaseContext);
  const [starredChannel, setStarredChannel] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");

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
            #{starredChannel.name}
          </ListItem>
        </List>
      ))
    );
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
              <ListItemText primary="STARRED" /> (
              <ListItemText style={{ textAlign: "center" }} primary={4} />)
            </ListItem>
          </List>
        </div>
      </Grid>
    </>
  );
}

export default Starred;
