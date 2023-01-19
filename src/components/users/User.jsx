import React, { useContext } from "react";
import profilPhoto from "../../assets/profileImg.png";
import { UserContext } from "../../context/UserContext";

import "./user.css";
const User = ({ photo, username, email }) => {
  const { currentUser } = useContext(UserContext);
  return (
    <li className="singleUser">
      <img src={photo ? photo : profilPhoto} alt="" />
      <p>
        {username}{" "}
        <span className="me">
          {username === currentUser?.displayName && "me"}
        </span>{" "}
        <span>{email}</span>{" "}
      </p>
    </li>
  );
};

export default User;
