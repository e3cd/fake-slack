import React, { useContext } from "react";
import SidePanel from "./SidePanel/SidePanel";
import MetaPanel from "./MetaPanel/MetaPanel";
import MessagesPanel from "./MessagesPanel/MessagesPanel";

import Grid from "@material-ui/core/Grid";

function Home() {
  const { user, firebase } = useContext;

  return (
    <Grid container style={{ background: "#eee" }}>
      <Grid item xs={2}>
        <SidePanel />
      </Grid>

      <Grid item xs={7}>
        <MessagesPanel />
      </Grid>
      <Grid item xs={3}>
        <MetaPanel />
      </Grid>
    </Grid>
  );
}

export default Home;
