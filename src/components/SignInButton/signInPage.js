import React from "react";
import { auth } from "../../firebase-config";
import { useState, useEffect } from "react";
import SignInButton from "./signInButton";
import SignOutButton from "./signOutButton";
import "./signInPage.scss";
import { db } from "../../firebase-config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const SignInPage = ({
  setParentUser,
  unsubscribe,
  setDataReady,
  loadDatabase,
  dataReady,
  setShowData,
  setIsAdmin,
}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [thisUser, setThisUser] = useState(null);

  const display = () => {
    return (
      <div id="signOutDiv">
        <h3>Logged in as </h3>
        <h3> {thisUser ? thisUser.displayName : "Not defined"}</h3>
        <SignOutButton
          setParentUser={setParentUser}
          unsubscribe={unsubscribe}
          setDataReady={setDataReady}
          dataReady={dataReady}
          setShowData={setShowData}
        />
      </div>
    );
  };

  const checkAdmin = (user) => {
    const q = query(collection(db, "users"), where("UserID", "==", user.uid));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().Admin) {
          setIsAdmin(true);
          console.log("User is an admin");
        }
      });
    });
  };

  useEffect(() => {
    const unlisten = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("Signed in Successfully");
          setLoggedIn(true);
          setThisUser(user);
          setParentUser(user);
          checkAdmin(user);
        } else {
          console.log("Not logged in");
          setLoggedIn(false);
          setThisUser(null);
        }
      });
    };

    return unlisten();
  }, []);

  return <div>{loggedIn ? display() : <SignInButton />}</div>;
};

export default SignInPage;
