import React, { useContext } from "react";
import SidePanel from "./SidePanel/SidePanel";
import MetaPanel from "./MetaPanel/MetaPanel";
import MessagesPanel from "./MessagesPanel/MessagesPanel";
import "./App.css";

function Home() {
  const { user, firebase } = useContext;

  return (
    <div>
      <SidePanel />
      <div className="home__container">
        <MessagesPanel />

        <MetaPanel />
      </div>
    </div>
  );
}

export default Home;
