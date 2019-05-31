import React, { Component } from "react";
import Home from "./Home";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import { Route, Switch, withRouter } from "react-router-dom";

// import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Switch>
      </div>
    );
  }
}

export default App;
