import React, { Component } from "react";
import firebase from "./../../config/firebase";
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

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    usersRef: firebase.database().ref("users"),
    isLoading: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      errors: []
    });
  };

  isUsernameValid = ({ username }) => {
    return username.length < 3 || username.length > 20 ? false : true;
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    const regex = new RegExp("^(?=.{6,})(?=.*[0-9])");
    return password.match(regex) || passwordConfirmation.match(regex)
      ? true
      : false;
  };

  arePasswordsSame = ({ password, passwordConfirmation }) => {
    return password === passwordConfirmation ? true : false;
  };

  //display error prop on text field
  renderInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? true
      : false;
  };

  //display input errors
  displayFormErrors = (errors, inputName) =>
    errors.map((error, index) => {
      return error.message.toLowerCase().includes(inputName) ? (
        <p key={index}>{error.message}</p>
      ) : (
        inputName
      );
    });

  //form validation
  isFormValid = () => {
    let errors = [];
    let error;

    if (!this.isUsernameValid(this.state)) {
      error = { message: "Username is invalid - Between 3 and 20 characters" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = {
        message: "Password invalid - At least six characters including 1 digit"
      };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.arePasswordsSame(this.state)) {
      error = { message: "Passwords do not match" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], isLoading: true });
      console.log("sent");
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(createdUser => {
            console.log(createdUser);
            createdUser.user
              .updateProfile({
                displayName: this.state.username,
                photoURL: `http://gravatar.com/avatar/${md5(
                  createdUser.user.email
                )}?d=identicon`
              })
              .then(() => {
                this.saveUser(createdUser).then(() => {
                  console.log("User saved");
                });
              });
          });
      } catch (error) {
        console.error(error);
        this.setState({
          errors: this.state.errors.concat(error),
          loading: false
        });
      }
    }
  };

  // create users cluster in firebase, obtain from user uid from firebase token and set user name and avatar
  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
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
            Register Account
          </Typography>
          <form
            className="form__body"
            validate="true"
            onSubmit={this.handleSubmit}
          >
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
                  label={
                    errors.length > 0
                      ? this.displayFormErrors(errors, "username")
                      : "User Name"
                  }
                  autoFocus
                  onChange={this.handleChange}
                  error={this.renderInputError(errors, "username")}
                  value={username}
                />
              </Grid>

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
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  name="passwordConfirmation"
                  label={
                    errors.length > 0
                      ? this.displayFormErrors(errors, "password")
                      : "Password Confirmation"
                  }
                  type="password"
                  id="passwordConfirmation"
                  onChange={this.handleChange}
                  error={this.renderInputError(errors, "password")}
                  value={passwordConfirmation}
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
              {isLoading ? <CircularProgress size={26} /> : "Register"}
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
