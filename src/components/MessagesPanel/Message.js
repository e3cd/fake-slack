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
  CardMedia,
  Paper
} from "@material-ui/core";
import { Image } from "semantic-ui-react";
// import moment from "moment";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "";
};

const isImage = message => {
  return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",

    backgroundColor: theme.palette.background.paper,
    overflow: "hidden",
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
      <ListItem className={classes.item} alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={message.user.avatar} />
        </ListItemAvatar>
        {isImage(message) ? (
          <>
            <Typography className={isOwnMessage(message, user)}>
              {" "}
              {message.user.name} - {distanceInWordsToNow(message.timestamp)}{" "}
              ago
            </Typography>

            {/* <image src={message.image} /> */}
            {/* <CardMedia image={message.image} className={classes.media} /> */}
            <Image
              src={message.image}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          </>
        ) : (
          <ListItemText
            className={isOwnMessage(message, user)}
            primary={
              <>
                {message.user.name} - {distanceInWordsToNow(message.timestamp)}{" "}
                ago
              </>
            }
            secondary={
              <>
                <Typography>{message.content}</Typography>
              </>
            }
          />
        )}
      </ListItem>
    </List>
  );
}

export default Message;
