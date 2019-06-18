import React, { useContext } from "react";
import FirebaseContext from "./../../firebase/context";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, InputBase, Divider } from "@material-ui/core/";
import {
  StarBorder as StarBorderIcon,
  Search as SearchIcon
} from "@material-ui/icons";
import { fade } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    flexGrow: "1",
    margin: "0 0 2rem 0",
    padding: theme.spacing(3, 2)
  },
  search: {
    position: "relative",
    display: "flex",
    flexDirection: "flex-end",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade("#EEEEEE", 0.8),
    "&:hover": {
      backgroundColor: fade("#BDBDBD", 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  divider: {
    width: 2,
    height: 28,
    margin: 16
  }
}));

function MessagesHeader({ numUniqueUsers, handleSearchChange }) {
  const { state } = useContext(FirebaseContext);

  const classes = useStyles();

  //display public and private channels differently
  function displayChannelName() {
    return state.isPrivateChannel ? "@" : "#";
  }

  function displayUserStatus() {
    if (state.directMessagesUsers && state.directMessagesUsers.length) {
      const userChannel = state.directMessagesUsers.filter(
        user => user.name === state.currentChannel.name
      );
      return userChannel[0].status;
    }
  }

  return (
    <div>
      <Paper className={classes.root}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" component="h3">
            {state.currentChannel.name && (
              <span>
                {displayChannelName()}
                {state.currentChannel.name}
              </span>
            )}
          </Typography>
          {!state.isPrivateChannel ? <StarBorderIcon /> : ""}
          <Divider className={classes.divider} />
          {state.isPrivateChannel ? displayUserStatus() : numUniqueUsers}
        </div>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            onChange={handleSearchChange}
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ "aria-label": "Search" }}
          />
        </div>
      </Paper>
    </div>
  );
}

export default MessagesHeader;
