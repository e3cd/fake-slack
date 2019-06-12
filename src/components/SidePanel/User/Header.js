import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { Chat as ChatIcon } from "@material-ui/icons";

function Header() {
  return (
    <Grid
      container
      justify="space-evenly"
      alignItems="center"
      style={{ margin: "1rem 0 1rem 0", color: "#eee" }}
    >
      <ChatIcon fontSize="large" />

      <Typography variant="h4">FakeSlack</Typography>
    </Grid>
  );
}

export default Header;
