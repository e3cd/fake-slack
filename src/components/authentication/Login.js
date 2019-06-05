import React, { useState } from "react";
// import firebase from "../../firebase/firebase";
import { Link } from "react-router-dom";
import md5 from "md5";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import Container from "@material-ui/core/Container";

import "./../App.css";

function Login(props) {
  const [login, setLogin] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="form__container">
        <Avatar
          style={{
            backgroundColor: "#17c6cc",
            margin: "1rem 1rem",
            width: "4rem",
            height: "4rem"
          }}
        >
          <HowToRegIcon style={{ width: "2rem", height: "2rem" }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register Account
        </Typography>
        <form className="form__body" validate="true">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="username"
                variant="standard"
                required
                fullWidth
                type="text"
                id="userName"
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                name="passwordConfirmation"
                type="password"
                id="passwordConfirmation"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem", backgroundColor: "#17c6cc" }}
            size="large"
          >
            Submit
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

export default Login;
