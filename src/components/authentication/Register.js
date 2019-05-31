import React, { Component } from "react";
import firebase from "./../../config/firebase";
import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import Typography from "@material-ui/core/Typography";

import Container from "@material-ui/core/Container";

import "./../App.css";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    usersRef: firebase.database().ref("users"),
    loading: false
  };

  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className="form__container">
          <Avatar style={{ backgroundColor: "#17c6cc", margin: "1rem 1rem" }}>
            <HowToRegIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register Account
          </Typography>
          <form className="form__body" Validate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fname"
                  name="userName"
                  variant="outlined"
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password Confirmation"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: "2rem", backgroundColor: "#17c6cc" }}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item style={{ marginTop: "2rem" }}>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default Register;
