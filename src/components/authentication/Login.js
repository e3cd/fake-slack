import React, { Component } from "react";
import firebase from "./../../config/firebase";
import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ChatIcon from "@material-ui/icons/Chat";
import Typography from "@material-ui/core/Typography";

import Container from "@material-ui/core/Container";

import "./../App.css";

class Login extends Component {
  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className="form__container">
          <Avatar style={{ backgroundColor: "#17c6cc", margin: "1rem 1rem" }}>
            <ChatIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in to FakeSlack
          </Typography>
          <form className="form__body" Validate>
            <Grid container spacing={2}>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: "2rem", backgroundColor: "#17c6cc" }}
            >
              Sign In
            </Button>
            <Grid container justify="flex-end">
              <Grid item style={{ marginTop: "2rem" }}>
                <Link to="/register" variant="body2">
                  Don't have an account? Register here
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default Login;
