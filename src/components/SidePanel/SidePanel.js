import React from "react";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

import Header from "./User/Header";
import User from "./User/User";
import Channels from "./Channels/Channels";

import "./../App.css";

const styles = theme => ({
  paper: { background: "rgb(4, 155, 229)" }
});

function SidePanel(props) {
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
          <Divider />
          <ListItem>
            <User />
          </ListItem>
          <ListItem>
            <Channels />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default withStyles(styles)(SidePanel);
