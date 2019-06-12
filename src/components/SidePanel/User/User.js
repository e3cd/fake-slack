import React, { useContext } from "react";
import FirebaseContext from "../../../firebase/context";
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
  const { user, firebase } = useContext(FirebaseContext);

  return (
    <>
      <Grid
        container
        justify="flex-start"
        alignItems="center"
        style={{ marginTop: "1rem" }}
      >
        <Avatar src={user.photoURL} style={{ marginLeft: "1rem" }} />

        {
          <FormControl style={{ marginLeft: "1rem" }}>
            <InputLabel
              style={{ marginLeft: "1rem", color: "#eee" }}
              htmlFor="outlined-age-simple"
            >
              {user.displayName}
            </InputLabel>
            <Select
              input={
                <OutlinedInput
                  style={{ width: "10rem", color: "#eee" }}
                  name="age"
                />
              }
            >
              <MenuItem disabled>{`Signed in as ${user.displayName}`}</MenuItem>
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
