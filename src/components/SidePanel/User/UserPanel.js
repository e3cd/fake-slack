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

  console.log(firebase);

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
              style={{ marginLeft: "3rem" }}
              htmlFor="outlined-age-simple"
            >
              {user.displayName}
            </InputLabel>
            <Select
              input={<OutlinedInput style={{ width: "10rem" }} name="age" />}
            >
              <MenuItem disabled>{`Signed in as ${user.displayName}`}</MenuItem>
              <MenuItem value="">Change Avatar</MenuItem>
              <MenuItem value="">
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
