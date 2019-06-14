import React, { useContext, useState } from "react";
import FirebaseContext from "./../../../firebase/context";

function DirectMessages() {
  const { user, state, firebase } = useContext(FirebaseContext);

  return <div>DirectMessages</div>;
}
