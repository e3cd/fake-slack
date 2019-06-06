import React, { useState, useContext } from "react";
import FirebaseContext from "./../../firebase/context";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

export default function ForgotPassword() {
  const { firebase } = useContext(FirebaseContext);

  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(null);

  const handleResetPassword = async () => {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setIsPasswordReset(true);
    } catch (error) {
      console.error("error sending email");
      setPasswordResetError(error.message);
      setIsPasswordReset(false);
    }
  };

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
          <LockOpenIcon style={{ width: "2rem", height: "2rem" }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password?
        </Typography>
        <form className="form__body" validate="true">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                label="Provide your account email"
                autoFocus
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
            Reset Password
          </Button>
        </form>
      </div>
    </Container>
  );
}
