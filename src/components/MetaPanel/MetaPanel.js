import React, { useState, useContext } from "react";
import FirebaseContext from "./../../firebase/context";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelActions,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";

import {
  ExpandMore as ExpandMoreIcon,
  People as PeopleIcon,
  Info as InfoIcon,
  Create as CreateIcon,
  PersonPin as PersonPinIcon
} from "@material-ui/icons/";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    paddingRight: "1rem"
  },
  heading: {
    marginLeft: "2rem"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  about: {
    display: "flex",
    justifyContent: "space-evenly"
  },
  avatar: {
    marginLeft: "1.5rem",
    width: 50,
    height: 50
  },
  panel: {
    width: "100%",
    height: "20vh",
    overflow: "auto"
  }
}));

function MetaPanel() {
  const { state } = useContext(FirebaseContext);

  const [expanded, setExpanded] = useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function displayTotalMembers(posts) {
    return Object.entries(posts).map(([key, val], i) => {
      return (
        <ListItem key={i}>
          <ListItemAvatar>
            <Avatar src={val.avatar} />
          </ListItemAvatar>
          <Typography variant="caption" display="block">
            {key}
          </Typography>
        </ListItem>
      );
    });
  }

  //object.entries converts key and value of each entry in object into own array, converts the object into array of arrays, use to sort from least to most

  function displayTopPosters(posts) {
    return Object.entries(posts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <ListItem key={i}>
          <ListItemAvatar>
            <Avatar src={val.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Typography variant="caption" display="block">
                  {key}
                </Typography>
              </>
            }
            secondary={
              <>
                <Typography variant="caption" display="block">
                  {formatCount(val.count)}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))
      .slice(0, 5);
  }

  function formatCount(num) {
    return num > 1 || num === 0 ? `${num} posts` : `${num} post`;
  }

  const classes = useStyles();

  if (state.isPrivateChannel) return null;

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelActions className={classes.about}>
          <Typography variant="overline" display="block">
            {state.channelMessages === null
              ? "Welcome to FakeSlack"
              : ` About ${state.currentChannel.name}`}
          </Typography>
        </ExpansionPanelActions>
      </ExpansionPanel>
      <Divider />
      <ExpansionPanel
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Avatar style={{ backgroundColor: "#3F51B5" }}>
            <PeopleIcon />
          </Avatar>
          <Typography
            variant="overline"
            display="block"
            className={classes.heading}
          >
            Members
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List className={classes.panel}>
            {state.userPosts && displayTotalMembers(state.userPosts)}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Avatar style={{ backgroundColor: "#4CAF50" }}>
            <InfoIcon />
          </Avatar>
          <Typography
            variant="overline"
            display="block"
            className={classes.heading}
          >
            Details
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{state.currentChannel.details}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Avatar style={{ backgroundColor: "#C51162" }}>
            <CreateIcon />
          </Avatar>
          <Typography
            variant="overline"
            display="block"
            className={classes.heading}
          >
            Created By
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {state.currentChannel.createdBy && (
            <>
              <Avatar
                src={state.currentChannel.createdBy.avatar}
                className={classes.avatar}
              />
              <Typography
                variant="overline"
                display="block"
                gutterBottom
                style={{ marginLeft: "2rem" }}
              >
                {state.currentChannel.createdBy.name}
              </Typography>
            </>
          )}
          <Typography />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Avatar style={{ backgroundColor: "#795548" }}>
            <PersonPinIcon />
          </Avatar>
          <Typography
            variant="overline"
            display="block"
            className={classes.heading}
          >
            Top Posters
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List className={classes.panel}>
            {state.userPosts && displayTopPosters(state.userPosts)}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default MetaPanel;
