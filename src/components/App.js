import React, { useState, useEffect } from "react";
import Home from "./Home";
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import { Route, Switch, withRouter } from "react-router-dom";

import firebase, { FirebaseContext } from "./../firebase";
// import useAuth from "./hooks/useAuth";
import Spinner from "./Spinner";

import "./App.css";

function App(props) {
  // const user = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        setLoading(false);
        props.history.push("/");
      } else {
        setUser(null);
        setLoading(false);
        props.history.push("/login");
      }
    });

    //return cleanup function to execute on unmount
    return () => unsubscribe();
  }, []);

  // console.log(user);
  // console.log(loading);
  // console.log(props);

  return (
    <FirebaseContext.Provider value={{ user, firebase }}>
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
