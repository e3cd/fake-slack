import React, { useContext } from "react";
import FirebaseContext from "./../../firebase/context";

import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";

function UserPanel() {
  const { user } = useContext(FirebaseContext);

  console.log(user);

  return (
    <>
      <Grid
        container
        justify="space-evenly"
        alignItems="center"
        style={{ margin: "1rem 0 1rem 0", padding: "0.65em" }}
      >
        <ChatIcon fontSize="large" />

        <Typography variant="h4">FakeSlack</Typography>
      </Grid>
      <Grid container justify="space-evenly" alignItems="center">
        <Avatar src={user.photoURL} style={{ margin: "10" }} />
        <Typography style={{ marginRight: "2rem" }} variant="p">
          FakeSlack
        </Typography>
      </Grid>
    </>
  );
}

export default UserPanel;
