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
import CircularProgress from "@material-ui/core/CircularProgress";

import Container from "@material-ui/core/Container";

import "./../App.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    isLoading: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      errors: []
    });
  };

  renderInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? true
      : false;
  };

  displayFormErrors = (errors, inputName) =>
    errors.map((error, index) => {
      return error.message.toLowerCase().includes(inputName) ? (
        <p key={index}>{error.message}</p>
      ) : (
        inputName
      );
    });

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], isLoading: true });
      console.log("sent");
    }
  };

  render() {
    const {
      email,
      password,

      errors,
      isLoading
    } = this.state;
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
            Login to FakeSlack
          </Typography>
          <form
            className="form__body"
            validate="true"
            onSubmit={this.handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  onChange={this.handleChange}
                  label={
                    errors.length > 0
                      ? this.displayFormErrors(errors, "email")
                      : "Email Address"
                  }
                  name="email"
                  autoComplete="email"
                  error={this.renderInputError(errors, "email")}
                  autoFocus
                  value={email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  name="password"
                  label={
                    errors.length > 0
                      ? this.displayFormErrors(errors, "password")
                      : "Password"
                  }
                  type="password"
                  id="password"
                  onChange={this.handleChange}
                  error={this.renderInputError(errors, "password")}
                  value={password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: "2rem", backgroundColor: "#17c6cc" }}
              disabled={isLoading}
              size="large"
            >
              {isLoading ? <CircularProgress size={26} /> : "Login"}
            </Button>
            <Grid container justify="flex-end">
              <Grid item style={{ marginTop: "2rem" }}>
                <Link to="/Register" variant="body2">
                  Don't have an account? Register
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
