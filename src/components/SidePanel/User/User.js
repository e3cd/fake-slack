import React, { useContext, useState, useEffect } from "react";
import FirebaseContext from "../../../firebase/context";
import useToggle from "./../../hooks/useToggle";
import FileUploader from "react-firebase-file-uploader";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  IconButton,
  LinearProgress,
  Badge
} from "@material-ui/core/";
import { PhotoCamera as PhotoCameraIcon } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  avatar: {
    marginLeft: "1.5rem",
    width: 60,
    height: 60
  },
  avatarLoad: {
    marginLeft: "1.5rem"
  },
  root: {
    background: "#FF7043",
    borderRadius: 3,
    width: "6.5rem",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
  },
  label: {
    zIndex: "99",
    color: "white",
    marginLeft: "2rem"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const BorderLinearProgress = withStyles({
  root: {
    marginTop: "2px",
    height: 5,
    backgroundColor: "#f7f7f7"
  },
  bar: {
    borderRadius: 20,
    backgroundColor: "#1d428a"
  }
})(LinearProgress);

function UserPanel() {
  const { currentUser, firebase } = useContext(FirebaseContext);
  const [uploadImage, setUploadImage] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useToggle(false);
  const [progress, setProgress] = useState(0);

  const storageRef = firebase.storage.ref(`avatars/users/${currentUser.uid}`);
  const usersRef = firebase.db.ref("users");
  const userRef = firebase.auth.currentUser;

  useEffect(() => {
    setUploadImage("");
  }, [uploadImage]);

  function handleUploadStart() {
    setUploading();
    setProgress(0);
  }

  function handleUploadError(error) {
    setUploading(false);
    console.error(error);
  }

  function handleProgress(progress) {
    setProgress(progress);
  }

  function handleUploadSuccess(filename) {
    console.log("hello");
    storageRef
      .child(filename)
      .getDownloadURL()
      .then(downloadUrl => {
        changeAvatar(downloadUrl);
        setProgress(0);
      })

      .catch(error => {
        console.error(error);
      });
  }

  async function changeAvatar(downloadUrl) {
    try {
      await userRef.updateProfile({
        photoURL: downloadUrl
      });

      updateAvatar(downloadUrl);
      setUploadImage(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateAvatar(downloadUrl) {
    try {
      await usersRef.child(currentUser.uid).update({
        avatar: downloadUrl
      });
    } catch (error) {
      console.error(error);
    }
  }

  const classes = useStyles();
  return (
    <>
      <Grid container justify="flex-start" alignItems="center">
        <div>
          <div>
            <Badge
              className={classes.margin}
              badgeContent={
                <>
                  <FileUploader
                    accept="image/*"
                    name="avatar-image"
                    id="icon-button-file"
                    randomizeFilename
                    storageRef={storageRef}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                    hidden
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton aria-label="Upload picture" component="span">
                      <PhotoCameraIcon />
                    </IconButton>
                  </label>
                </>
              }
            >
              <Avatar src={currentUser.photoURL} className={classes.avatar} />
            </Badge>
            <BorderLinearProgress
              variant="determinate"
              color="primary"
              value={progress}
              className={classes.avatarLoad}
              style={{ visibility: progress === 0 ? "hidden" : "visible" }}
            />
          </div>
        </div>
        {
          <FormControl style={{ marginLeft: "2rem" }}>
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

              <MenuItem value="signOut">
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
