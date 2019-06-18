import React, { useContext, useState } from "react";
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

  const useStyles = makeStyles(theme => ({
    form: {
      marginLeft: "1.5rem"
    },
    root: {
      background: "#FF7043",
      borderRadius: 3,
      width: "8rem",
      boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
    },
    label: {
      zIndex: "99",
      color: "white",
      marginLeft: "2.5rem"
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

  const styles = theme => ({
    margin: {
      margin: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 3
    }
  });

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
        // console.log(downloadUrl);
        // setUploadImage(downloadUrl);
        // console.log(uploadImage);
        changeAvatar(downloadUrl);
      })
      .catch(error => {
        console.error(error);
      });
    // console.log(getStorageRef.child(filename));
  }

  // function handleUploadSuccess(filename) {
  //   const pathToUpload = state.currentChannel.id;
  //   console.log(pathToUpload);

  //   setProgress(100);
  //   setUploading();
  //   storageRef()
  //     .child(filename)
  //     .getDownloadURL()
  //     .then(downloadUrl => {
  //       sendFileMessage(downloadUrl, getMessagesRef(), pathToUpload);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       setErrors(error);
  //     });
  //   // console.log(getStorageRef.child(filename));
  // }

  function changeAvatar(downloadUrl) {
    console.log(downloadUrl);

    console.log(uploadImage);
    userRef
      .updateProfile({
        photoURL: downloadUrl
      })
      .then(() => {
        console.log("Photourl updated");
      })
      .catch(err => {
        console.error(err);
      });

    usersRef
      .child(currentUser.uid)
      .update({
        avatar: downloadUrl
      })
      .then(() => {
        console.log("user avatar updated");
      })
      .catch(err => {
        console.error(err);
      });
  }

  console.log(userRef);
  console.log(progress);
  console.log(uploadImage);
  const classes = useStyles();
  return (
    <>
      <Grid container justify="flex-start" alignItems="center">
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
            <Avatar src={userRef.photoURL} className={classes.form} />
          </Badge>
          <BorderLinearProgress
            variant="determinate"
            color="primary"
            value={progress}
            style={{ visibility: progress === 0 ? "hidden" : "visible" }}
          />
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
