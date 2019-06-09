import React, { useState } from "react";

import {
  Avatar,
  ListItemAvatar,
  Typography,
  Grid,
  List,
  ListItem,
  makeStyles,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";
import {
  List as ListIcon,
  Add as AddIcon,
  ListItem as ListItemIcon
} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: theme.spacing(4, 0, 2)
  }
}));

function Channels() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  console.log(open);
  return (
    <>
      <Grid item xs={12}>
        <div className={classes.demo}>
          <List dense={true}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ListIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="CHANNELS" />
              <ListItemSecondaryAction onClick={handleClickOpen}>
                <IconButton edge="end" aria-label="Delete">
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Channel</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name of Channel"
              type="text"
              fullWidth
            />
            <TextField
              margin="dense"
              id="name"
              label="About the Channel"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Add
            </Button>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

export default Channels;
