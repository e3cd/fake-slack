import React, { useState } from "react";
import { Link } from "react-router-dom";
import validateLogin from "./validation/validateLogin";
import useFormValidation from "./../hooks/useFormValidation";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Container
} from "@material-ui/core";
import { Chat as ChatIcon } from "@material-ui/icons";

import firebase from "./../../firebase";

import "./../App.css";

const INITIAL_STATE = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: ""
};

function Login(props) {
  const { values, errors, handleSubmit, handleChange } = useFormValidation(
    INITIAL_STATE,
    validateLogin,
    authenticateUser
  );
  const [submitting, setSubmitting] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  async function authenticateUser() {
    const { email, password } = values;

    try {
      setSubmitting(true);
      await firebase.login(email, password);
      setSubmitting(false);
      props.history.push("/");
    } catch (error) {
      console.error("authentication error", error);
      setFirebaseError(error.message);
      setSubmitting(false);
    }
  }

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
          <ChatIcon style={{ width: "2rem", height: "2rem" }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login to FakeSlack
        </Typography>
        <form className="form__body" validate="true" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                type="email"
                id="email"
                name="email"
                label={errors.email ? errors.email : "Email"}
                error={errors.email ? true : false}
                autoComplete="email"
                autoFocus
                onChange={handleChange}
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
                label={errors.password ? errors.password : "Password"}
                onChange={handleChange}
                values={values.password}
                error={errors.password ? true : false}
              />
            </Grid>
          </Grid>

          {firebaseError && (
            <Typography color="error" style={{ marginTop: "2rem" }}>
              {firebaseError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem", backgroundColor: "#17c6cc" }}
            size="large"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={26} /> : "Login"}
          </Button>

          <Grid container justify="flex-start">
            <Grid item style={{ marginTop: "2rem" }}>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button fullWidth>Don't have an account?</Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container justify="flex-start">
            <Grid item>
              <Link style={{ textDecoration: "none" }} to="/forgot">
                <Button>Forgot Password?</Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Login;
