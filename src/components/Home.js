import React, { useContext } from "react";
import SidePanel from "./SidePanel/SidePanel";
import MetaPanel from "./MetaPanel/MetaPanel";
import MessagesPanel from "./MessagesPanel/MessagesPanel";

import Grid from "@material-ui/core/Grid";

function Home() {
  const { user, firebase } = useContext;

  return (
    <Grid container style={{ background: "#eee" }}>
      <Grid item xs>
        <SidePanel />
      </Grid>

      <Grid item xs={7} className="messagespanel">
        <MessagesPanel />
      </Grid>
      <Grid item xs>
        <MetaPanel />
      </Grid>
    </Grid>
  );
}

export default Home;
