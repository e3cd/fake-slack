import React, { useContext, useState } from "react";
import FirebaseContext from "./../../firebase/context";
import mime from "mime-types";
import uuidv4 from "uuid/v4";

import { makeStyles } from "@material-ui/core/styles";
import { CloudUpload as CloudUploadIcon } from "@material-ui/icons";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  fileInput: {
    display: "none"
  }
}));

function FileUpload() {
  const [file, setFile] = useState(null);
  const [validFile, setValidFile] = useState(["image/jpeg", "image/png"]);
  const [uploadState, setUploadState] = useState("");
  const [uploadTask, setUploadTask] = useState(null);
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [errors, setErrors] = useState([])

  const { state, user, firebase } = useContext(FirebaseContext);

  /**
   *
   * Functions
   *
   */
  function addFile(event) {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  }

  function isValidFile(filename) {
    validFile.includes(mime.lookup(filename));
  }

  function clearFile() {
    setFile(null);
  }

  //private or public channel will determin the filepath
  function getPath() {
    if (state.isPrivateChannel) {
      return `chat/private/${state.currentChannel.id}`;
    } else {
      return `chat/public`;
    }
  }

  function uploadFile(file, metadata) {
    const pathToUpload = state.currentChannel.id;
    const ref = firebase.db.ref("messages");
    const storageRef = firebase.storage.ref();
    const filePath = `${getPath()}/${uuidv4()}.jpg`;

    // console.log(ref);
    setUploadState('uploading');
    setUploadTask(storageRef.child(filePath).put(file, metadata))

     {
        uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            setPercentUploaded(percentUploaded)
          
          },
          err => {
            console.error(err);
            setErrors([...err])
            setUploadState('error')
            setUploadTask(null)
           
          },
          () => {
            uploadTask.snapshot.ref
              //method for retrieving file url
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }


  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errors: this.state.errors.concat(err)
        });
      });
  };

//     this.setState(
//       {
//         uploadState: "uploading",
//         uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
//       },
//       () => {
//         this.state.uploadTask.on(
//           "state_changed",
//           snap => {
//             const percentUploaded = Math.round(
//               (snap.bytesTransferred / snap.totalBytes) * 100
//             );
//             this.setState({ percentUploaded });
//           },
//           err => {
//             console.error(err);
//             this.setState({
//               errors: this.state.errors.concat(err),
//               uploadState: "error",
//               uploadTask: null
//             });
//           },
//           () => {
//             this.state.uploadTask.snapshot.ref
//               //method for retrieving file url
//               .getDownloadURL()
//               .then(downloadUrl => {
//                 this.sendFileMessage(downloadUrl, ref, pathToUpload);
//               })
//               .catch(err => {
//                 console.error(err);
//                 this.setState({
//                   errors: this.state.errors.concat(err),
//                   uploadState: "error",
//                   uploadTask: null
//                 });
//               });
//           }
//         );
//       }
//     );
//   }

  function sendFile() {
    if (file !== null) {
      if (this.isValidFile(file.name)) {
        const metaData = { contentType: mime.lookup(file.name) };
        uploadFile(file, metaData);
        clearFile();
      }
    }
  }

  const classes = useStyles();
  return (
    <div>
      <input
        accept="image/*"
        className={classes.fileInput}
        id="contained-button-file"
        multiple
        type="file"
        onChange={console.log("change")}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          color="secondary"
          component="span"
          className={classes.button}
        >
          Upload
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>
      </label>
    </div>
  );
}

export default FileUpload;
