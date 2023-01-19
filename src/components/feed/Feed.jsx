import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import Post from "../Post/Post";
import profilPhoto from "./../../assets/profileImg.png";
import Loading from "../Loading/Loading";
import User from "../users/User";
import "./feed.css";

const Feed = () => {
  const { currentUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [feedPost, setFeedPost] = useState([]);

  // fetching  posts from firebase
  useEffect(() => {
    const colRef = collection(db, "Posts");
    const q = query(colRef, orderBy("time", "desc"));
    onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs);
      setLoading(false);
    });
  }, [ posts]);

  // fetching users
  useEffect(() => {
    const userRef = collection(db, "users");
    onSnapshot(userRef, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
  }, [ users]);

  // fetch following people
  useEffect(() => {
    const colRef = collection(db, "users", currentUser.uid, "following");
    onSnapshot(colRef, (snapshot) => {
      setFollowingUsers(snapshot.docs);
    });
  }, [currentUser?.uid]);
  // filtering post to show only the post from the following people
  useEffect(() => {
    const newPostFeed = posts.filter((post) => {
      return followingUsers.find((user) => {
        return post?.data()?.username === user?.data()?.username;
      });
    });

    setFeedPost(newPostFeed);
  }, [followingUsers, posts ]);
  if (loading) return <Loading />;
  return (
    <div className="container feed_container">
      <div className="users">
        <h1>Users</h1>
        <ul>
          {users.map((usr) => (
            <Link key={usr.uid} to={`/profile/${usr?.uid}`}>
              <User
                photo={usr?.photoURL ? usr?.photoURL : profilPhoto}
                username={usr?.username}
                email={usr?.email}
              />
            </Link>
          ))}
        </ul>
      </div>
      {
        <div className="feed">
          {feedPost.length === 0 ? (
            <div className="No_post">
              <h1>Hello {currentUser?.displayName}, your feed is empty </h1>
              <p>
                Your feed displays the latest posts from the people that you
                follow. If you don't have any friends to follow that's okay; you
                can click on the users find content written by people with
                similar interests and then follow them.
              </p>
            </div>
          ) : (
            <div className="container">
              <h1 className="l_post">The Latest posts </h1>
              {feedPost.map((post) => (
                <Post
                  id={post?.id}
                  title={post.data().title}
                  content={post.data().content}
                  email={post.data().email}
                  photoURL={post.data().photoURL}
                  time={post.data().time}
                  username={post.data().username}
                />
              ))}
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default Feed;
