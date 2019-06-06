import React, { useState } from "react";
import { Link } from "react-router-dom";
import validateRegister from "./validateRegister";
import useFormValidation from "./../hooks/useFormValidation";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

import firebase from "./../../firebase";

import "./../App.css";

const INITIAL_STATE = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: ""
};

function Login(props) {
  const {
    values,
    errors,
    isSubmitting,

    handleSubmit,
    handleChange
  } = useFormValidation(INITIAL_STATE, validateRegister, authenticateUser);

  const [submitting, setSubmitting] = useState(false);

  async function authenticateUser() {
    const { username, email, password } = values;

    try {
      setSubmitting(true);
      await firebase.register(username, email, password);
      setSubmitting(false);
      props.history.push("/");
    } catch (error) {
      console.error("authentication error", error);

      setSubmitting(false);
    }
  }

  console.log(errors);

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
          Create an account
        </Typography>
        <form className="form__body" validate="true" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                name="username"
                variant="standard"
                required
                fullWidth
                type="text"
                id="userName"
                autoFocus
                label={errors.username ? errors.username : "Username"}
                error={errors.username ? true : false}
                onChange={handleChange}
                values={values.username}
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

            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                name="passwordConfirm"
                type="password"
                id="passwordConfirm"
                label={
                  errors.passwordConfirm
                    ? errors.passwordConfirm
                    : "Confirm password"
                }
                onChange={handleChange}
                values={values.passwordConfirm}
                error={errors.passwordConfirm ? true : false}
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
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={26} /> : "Register"}
          </Button>

          <Grid container justify="flex-start">
            <Grid item style={{ marginTop: "2rem" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button fullWidth>Already have an account?</Button>
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
