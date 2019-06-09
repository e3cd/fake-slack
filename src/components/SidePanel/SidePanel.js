import React from "react";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

import Header from "./User/Header";
import User from "./User/User";
import Channels from "./Channels/Channels";

import "./../App.css";

function SidePanel() {
  return (
    <div className="userpanel">
      <Drawer variant="permanent" anchor="left">
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

export default SidePanel;
