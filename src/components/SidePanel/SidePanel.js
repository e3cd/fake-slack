import React from "react";
import { Drawer, Divider, List, ListItem } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/styles";

import Header from "./User/Header";
import User from "./User/User";
import Channels from "./Channels/Channels";
import DirectMessages from "./DirectMessages/DirectMessages";
import Starred from "./Starred/Starred";
import "./../App.css";

const styles = theme => ({
  paper: { background: "rgb(4, 155, 229)" }
});

const useStyles = makeStyles(theme => ({
  divider: {
    margin: 16

    // margin: "2rem 0 2rem 0"
  }
}));

function SidePanel(props) {
  const classes = useStyles();
  return (
    <div className="userpanel">
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{ paper: props.classes.paper }}
      >
        <List>
          <ListItem>
            <Header />
          </ListItem>
          <Divider className={classes.divider} />
          <ListItem>
            <User />
          </ListItem>
          <Divider className={classes.divider} />
          <ListItem>
            <Starred />
          </ListItem>
          <Divider className={classes.divider} />
          <ListItem>
            <Channels />
          </ListItem>
          <Divider className={classes.divider} />
          <ListItem>
            <DirectMessages />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default withStyles(styles)(SidePanel);
