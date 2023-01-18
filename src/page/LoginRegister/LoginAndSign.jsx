import React, { useState } from "react";
import "./lands.css";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { doc, setDoc } from "firebase/firestore";

const LoginAndSign = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await updateProfile(res.user, {
        displayName: username,
      });

      //create user on firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        username,
        email,
      });

      //create empty user chats on firestore
      await setDoc(doc(db, "userChats", res.user.uid), {});
    } catch (err) {
      console.log(err);
    }

    setUsername("");
    setEmail("");
    setPassword("");
  };
  return (
    <div className="Login__signup ">
      <Header />
      {/* body */}
      <div className="Login__signin_body container">
        <div className="left_side">
          <p>Remember writing?</p>
          <p>
            Are you sick of short tweets and impersonal "shared" posts that are
            reminiscent of the late 90's email forwards? We believe getting back
            to actually writing is the key to enjoying the internet again.
          </p>
        </div>
        <div className="right_side">
          <form className="SignUp_form" onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Pick a Username"
              />
            </div>
            <div>
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                id="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="Pass">Password</label>
              <input
                minLength="8"
                required
                type="password"
                id="Pass"
                autoComplete="on"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit"> Sign up for OurApp</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginAndSign;
