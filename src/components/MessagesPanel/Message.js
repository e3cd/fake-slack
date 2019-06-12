import React, { useContext } from "react";
import FirebaseContext from "./../../firebase/context";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Avatar,
  makeStyles,
  Paper
} from "@material-ui/core";
import moment from "moment";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "";
};

const isImage = message => {
  return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
};

const timeFromNow = timestamp => moment(timestamp).fromNow();

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",

    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxHeight: 300
  },
  inline: {
    display: "inline"
  }
}));

function Message({ message }) {
  const classes = useStyles();

  const { user } = useContext(FirebaseContext);

  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={message.user.avatar} />
        </ListItemAvatar>
        <ListItemText
          className={isOwnMessage(message, user)}
          primary={
            <>
              {message.user.name} - {timeFromNow(message.timestamp)}
            </>
          }
          secondary={<>{message.content}</>}
        />
      </ListItem>
    </List>
  );
}

export default Message;
