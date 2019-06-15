import React, { useContext } from "react";
import FirebaseContext from "../../../firebase/context";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from "@material-ui/core/";

function UserPanel() {
  const { currentUser, firebase } = useContext(FirebaseContext);

  const useStyles = makeStyles({
    form: {
      marginLeft: "1rem"
    },
    root: {
      background: "#FF7043",
      borderRadius: 3,
      width: "10rem",
      boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
    },
    label: {
      zIndex: "99",
      textTransform: "capitalize",
      color: "white",
      marginLeft: "3.5rem"
    }
  });

  const classes = useStyles();
  return (
    <>
      <Grid
        container
        justify="flex-start"
        alignItems="center"
        style={{ marginTop: "1rem" }}
      >
        <Avatar src={currentUser.photoURL} className={classes.form} />

        {
          <FormControl style={{ marginLeft: "1rem" }}>
            <InputLabel htmlFor="outlined-age-simple" className={classes.label}>
              {currentUser.displayName}
            </InputLabel>
            <Select
              input={
                <OutlinedInput
                  // style={{ width: "10rem", color: "#eee" }}
                  className={classes.root}
                  name="age"
                />
              }
            >
              <MenuItem disabled>{`Signed in as ${
                currentUser.displayName
              }`}</MenuItem>
              <MenuItem value="">Change Avatar</MenuItem>
              <MenuItem value="SignOut">
                <span onClick={() => firebase.logout()}>Sign Out</span>
              </MenuItem>
            </Select>
          </FormControl>
        }
      </Grid>
    </>
  );
}

export default UserPanel;
