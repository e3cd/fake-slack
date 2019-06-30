import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

const Spinner = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      <CircularProgress size={60} style={{ marginBottom: "10px" }} />
      Loading...
    </div>
  );
};

export default Spinner;
