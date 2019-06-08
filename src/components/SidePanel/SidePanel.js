import React from "react";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

import Header from "./User/Header";
import UserPanel from "./User/UserPanel";

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
            <UserPanel />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default SidePanel;
