import React, { useContext, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

import "./createPost.css";

const CreatePost = () => {
  const { currentUser } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [load , setLoad] = useState(false)
  const nav = useNavigate();

// upload the post to the fire base
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true)
    const colRef = collection(db, "Posts");
    try {
      await addDoc(colRef, {
        username: currentUser?.displayName,
        email: currentUser?.email,
        photoURL: currentUser?.photoURL,
        title: title,
        content: content,
        time: serverTimestamp(),
      });
    } catch {
      console.log(Error.name);
    }
    setTitle("");
    setContent("");
    setLoad(false)
    nav('/')
  };
  return (
    <div className="Create_post container">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="title">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="content">
          <label htmlFor="content">Body Content</label>
          <textarea
            type="text"
            id="content"
            placeholder="type what is in your mind"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className={`${ title && content ? "active_btn" : "disabled_btn" }`} > {load ? "Saving..." : "Save New Post"} </button>
      </form>
    </div>
  );
};

export default CreatePost;
