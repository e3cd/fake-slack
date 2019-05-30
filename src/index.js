import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Root from "./Root";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Root>
    <Router>
      <App />
    </Router>
  </Root>,
  document.querySelector("#root")
);
