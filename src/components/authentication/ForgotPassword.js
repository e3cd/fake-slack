import React, { useState, useContext } from "react";
import FirebaseContext from "./../../firebase/context";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

import "./../App.css";

export default function ForgotPassword() {
  const { firebase } = useContext(FirebaseContext);

  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(null);

  const handleResetPassword = async () => {
    try {
      setSubmitting(true);
      await firebase.resetPassword(resetPasswordEmail);
      setIsPasswordReset(true);
      setSubmitting(false);
    } catch (error) {
      console.error("error sending email");
      setPasswordResetError(error.message);
      setIsPasswordReset(false);
      setSubmitting(false);
    }
  };

  //   console.log(resetPasswordEmail);
  //   console.log(isPasswordReset);
  console.log(passwordResetError);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="forgot__container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar
            style={{
              backgroundColor: "#17c6cc",
              margin: "1rem 1rem",
              width: "4rem",
              height: "4rem"
            }}
          >
            <LockOpenIcon style={{ width: "2rem", height: "2rem" }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password?
          </Typography>
        </div>
        <div className="form__body">
          <Grid container spacing={2}>
            <Grid item xs={12} zeroMinWidth={false}>
              <TextField
                variant="standard"
                required
                fullWidth
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                label="Provide you account email"
                autoFocus
                onChange={event => setResetPasswordEmail(event.target.value)}
              />
            </Grid>
          </Grid>
          {isPasswordReset && (
            <Typography style={{ marginTop: "2rem" }}>
              Check email to reset password
            </Typography>
          )}
          {passwordResetError && (
            <Typography color="error" style={{ marginTop: "2rem" }}>
              {passwordResetError}
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
            onClick={handleResetPassword}
          >
            {submitting ? <CircularProgress size={26} /> : "Reset"}
          </Button>

          <Grid container justify="flex-start">
            <Grid item style={{ marginTop: "2rem" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button fullWidth>Back to login</Button>
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
}
