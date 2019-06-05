import React from "react";
import Home from "./Home";
import Login from "./authentication/Login";
import ForgotPassword from "./authentication/ForgotPassword";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import firebase, { FirebaseContext } from "./../firebase";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{ firebase }}>
        <div className="route-container">
          <Switch>
            <Route exact path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/forgot" exact component={ForgotPassword} />
          </Switch>
        </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}
