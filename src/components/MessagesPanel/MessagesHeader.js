import React, { useContext } from "react";
import FirebaseContext from "./../../firebase/context";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, InputBase } from "@material-ui/core/";
import {
  StarBorder as StarBorderIcon,
  Search as SearchIcon
} from "@material-ui/icons";
import { fade } from "@material-ui/core/styles/colorManipulator";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexGrow: "1",
    alignItems: "center",
    margin: "0 0 2rem 0",
    padding: theme.spacing(3, 2)
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
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
  }
}));

function MessagesHeader() {
  const { state, dispatch } = useContext(FirebaseContext);

  const classes = useStyles();

  //   console.log(state.currentChannel);
  return (
    <div>
      <Paper className={classes.root}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" component="h3">
            {state.currentChannel.name && (
              <span>@{state.currentChannel.name}</span>
            )}
          </Typography>
          <StarBorderIcon />
        </div>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
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
