import React, { useContext, useState } from "react";
import profileImg from "../../assets/profileImg.png";
import { UserContext } from "../../context/UserContext";
import { AiFillHome } from "react-icons/ai";
import { BsChatFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);

  // signin
  const handleSubmit = async (e) => {
    setErr(false);

    e.preventDefault();
    setLoad(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.log("err");
      setErr(true);
    }
    setLoad(false);
  };

  return (
    <div>
      <div className="header">
        <div className=" container">
          <h1 className="Logo">OurApp</h1>
          {!currentUser ? (
            <form className="LoginForm" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit"> {load ? "Signing..." : "Sign In"}</button>
              {err && (
                <p className="msgErr">
                  email or password are not correct, try a gain
                </p>
              )}
            </form>
          ) : (
            <div className="options">
              <i className="Icon">
                <Link to={"/"}>
                  <AiFillHome />
                </Link>
              </i>
              <i className="Icon">
                <Link to={"/chats"}>
                  <BsChatFill />
                </Link>
              </i>
              <Link to={`/profile/${currentUser?.uid}`}>
                <img
                  src={
                    currentUser?.photoURL ? currentUser?.photoURL : profileImg
                  }
                  alt=""
                />
              </Link>
              <Link to="/createPost">
                <button className="create_post">Create Post</button>
              </Link>
              <button className="sign_out" onClick={() => signOut(auth)}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
