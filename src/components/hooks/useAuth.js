import { useEffect, useState } from "react";
import firebase from "./../../firebase";

export default props => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(props);
  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        setAuthUser(user);
        setLoading(false);
      } else {
        setAuthUser(null);
        setLoading(true);
      }
    });

    //return cleanup function to execute on unmount
    return () => unsubscribe();
  }, []);

  return [loading, authUser];
};
