import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import md5 from "md5";

import firebaseConfig from "./config";

//authentication controller

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
  }

  async register(username, email, password) {
    const newUser = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return await newUser.user
      .updateProfile({
        displayName: username,
        photoURL: `http://gravatar.com/avatar/${md5(
          newUser.user.email
        )}?d=identicon`
      })
      .then(() => {
        this.saveUser(newUser).then(() => {
          console.log("User saved");
        });

        console.log(newUser);
      });
  }

  //save new user to fb
  async saveUser(newUser) {
    return await this.db
      .ref("users")
      .child(newUser.user.uid)
      .set({
        name: newUser.user.displayName,
        avatar: newUser.user.photoURL
      });
  }

  async login(email, password) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut().then(() => console.log("user signed out"));
  }

  async resetPassword(email) {
    await this.auth.sendPasswordResetEmail(email);
  }

  // async addChannel(channelsRef, channelName, channelDetails, user) {
  //   // generate unique id through push method which generates key for unique id for each channel
  //   const key = channelsRef.push().key;

  //   // create new channel field
  //   const newChannel = {
  //     id: key,
  //     name: channelName,
  //     details: channelDetails,
  //     createdBy: {
  //       name: user.displayName,
  //       avatar: user.photoURL
  //     }
  //   };

  //   try {
  //     await channelsRef
  //       .child(key)
  //       .update(newChannel)
  //       .then(() => {
  //         setChannelName("");
  //         setchannelDetails("");
  //         handleClose();
  //       });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}

const firebase = new Firebase();
export default firebase;
