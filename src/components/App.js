import React, { useState, useEffect, useContext, useReducer } from "react";
import globalReducer from "./../reducers";
import Home from "./Home";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import { Route, Switch, withRouter } from "react-router-dom";

import firebase, { FirebaseContext } from "./../firebase";
import Spinner from "./Spinner";

import "./App.css";

function App(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialState = useContext(FirebaseContext);
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    const listen = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        props.history.push("/");
      } else {
        props.history.push("/login");
        setCurrentUser(null);
        setLoading(false);
      }
    });

    //return cleanup function to execute on unmount
    return () => listen();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ state, dispatch, currentUser, firebase }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <div className="route-container">
          <Switch>
            <Route exact path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/forgot" exact component={ForgotPassword} />
          </Switch>
        </div>
      )}
    </FirebaseContext.Provider>
  );
}

export default withRouter(App);
