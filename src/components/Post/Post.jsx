import React, { useContext } from "react";
import "./post.css";
import avatar from "../../assets/profileImg.png";
import { BiTrash } from "react-icons/bi";
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { UserContext } from "../../context/UserContext";
const Post = ({ id, title, content, email, photoURL, time, username }) => {
  const { currentUser } = useContext(UserContext);
  const DeletePost = (id) => {
    if (window.confirm("are you sure")) {
      const colRef = doc(db, "Posts", id);
      deleteDoc(colRef).then(() => {});
    }
  };

  return (
    <div className="post">
      <div className="post_header">
        <img src={photoURL ? photoURL : avatar} alt="profile_photo" />
        <div className="header_info">
          <p>
            <span>{title}</span>by<span>{username}</span> on{" "}
            <span>{new Date(time * 1000).toUTCString().slice(0, 11)}</span>{" "}
          </p>
          <p>{email}</p>
        </div>
        {currentUser?.displayName === username && (
          <div className="del_btn" onClick={() => DeletePost(id)}>
            <BiTrash />
          </div>
        )}
      </div>
      <div className="post_body">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Post;
