import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContect";
import profileImg from "../../assets/profileImg.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Box from "@mui/material/Box";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { useParams } from "react-router-dom";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { BiChat } from "react-icons/bi";
import Post from "../Post/Post";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import User from "../users/User";
import { Link } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const { currentUser } = useContext(UserContext);
  const [user, setUser] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [profilePost, setProfilePost] = useState([]);
  const [value, setValue] = React.useState("1");
  const [isFollowed, setIsFollowed] = useState(false);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // fetching profile post
  useEffect(() => {
    try {
      const colRef = collection(db, "Posts");
      const q = query(colRef, orderBy("time", "desc"));
      onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs);
        setProfilePost(
          posts.filter((post) => post?.data()?.username === user[0]?.username)
        );
      });
    } catch (err) {
      console.log("err");
    }
  }, [id, db, posts]);

  // fetching users
  useEffect(() => {
    const userRef = collection(db, "users");
    onSnapshot(userRef, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);
  //  user profile
  useEffect(() => {
    setUser(
      users.filter((user) => {
        return user.uid === id;
      })
    );
  }, [id, users]);
  // fetching followres
  useEffect(() => {
    const colRef = collection(db, "users", id, "followed");
    onSnapshot(colRef, (snapshot) => {
      setFollower(snapshot.docs);
    });
  }, []);
  // fetching following
  useEffect(() => {
    const colRef = collection(db, "users", id, "following");
    onSnapshot(colRef, (snapshot) => {
      setFollowing(snapshot.docs);
    });
  }, []);
  // checking if follow or not
  useEffect(
    () =>
      setIsFollowed(
        follower.findIndex((follower) => follower.id === currentUser?.uid) !==
          -1
      ),
    [follower]
  );
  // handle select on for chat button to crete a chat with the decided user
  const handleSelect = async () => {
    const combinedId =
      currentUser?.uid > user[0]?.uid
        ? currentUser?.uid + user[0]?.uid
        : user[0]?.uid + currentUser?.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        //create chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //create a user chat
        await updateDoc(doc(db, "userChats", currentUser?.uid), {
          [combinedId + ".userInfo"]: {
            uid: user[0]?.uid,
            username: user[0]?.username,
          },
          [combinedId + ".date"]: {
            data: serverTimestamp(),
          },
        });

        await updateDoc(doc(db, "userChats", user[0]?.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser?.uid,
            username: currentUser?.displayName,
          },
          [combinedId + ".date"]: {
            data: serverTimestamp(),
          },
        });
      }
    } catch (err) {}
    nav("/chats");
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    setIsUploadingPhoto(true);
    try {
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${currentUser?.displayName + date}`);

      await uploadBytesResumable(storageRef, profileImage).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(currentUser, {
              photoURL: downloadURL,
            });

            await updateDoc(doc(db, "users", currentUser?.uid), {
              photoURL: downloadURL,
            });
          } catch (err) {
            console.log("err");
          }
        });
      });
    } catch (err) {
      console.log("err");
    }
    setProfileImage("");
    setIsUploadingPhoto(false);
  };
  // function for following and follower control
  const follow = async () => {
    if (isFollowed) {
      await deleteDoc(doc(db, "users", id, "followed", currentUser.uid));
      await deleteDoc(doc(db, "users", currentUser.uid, "following", id));
    } else {
      try {
        await setDoc(doc(db, "users", id, "followed", currentUser.uid), {
          username: currentUser?.displayName,
          photoURL: currentUser?.photoURL ? currentUser?.photoURL : null,
          email: currentUser?.email,
          uid: currentUser?.uid,
        });
      } catch (err) {
        console.log(err);
        console.log(err);
      }
      try {
        await setDoc(doc(db, "users", currentUser.uid, "following", id), {
          username: user[0]?.username,
          email: user[0]?.email,
          uid: user[0]?.uid,
          photoURL: user[0]?.photoURL ? user[0]?.photoURL : null,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="container">
      <div className="profile">
        <div className="profile_header">
          <img
            className="profileImg"
            src={user[0]?.photoURL ? user[0]?.photoURL : profileImg}
            alt=""
          />

          <div>
            <span>{user[0]?.username}</span>
            <span>{user[0]?.email}</span>
            {currentUser?.displayName !== user[0]?.username && (
              <div className="btns">
                <div className="follow" onClick={() => follow()}>
                  {!isFollowed ? (
                    <button style={{ backgroundColor: "#007bff" }}>
                      <RiUserFollowFill />
                      Follow
                    </button>
                  ) : (
                    <button style={{ backgroundColor: "#ff3e3e" }}>
                      <RiUserUnfollowFill />
                      Un Follow
                    </button>
                  )}
                </div>
                <button onClick={() => handleSelect()} className="chat_btn">
                  chat
                  <BiChat />
                </button>
              </div>
            )}
          </div>
          {currentUser?.displayName === user[0]?.username && (
            <>
              <label className="edit_img" htmlFor="pic">
                <FiEdit /> <span>Upload Profile Img</span>
              </label>
              <form onSubmit={(e) => handleUploadPhoto(e)}>
                <input
                  type="file"
                  id="pic"
                  style={{ display: "none" }}
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
                {profileImage && (
                  <div className="upload_photo">
                    <img
                      className="image"
                      src={URL.createObjectURL(profileImage)}
                    />
                    <div>
                      <button type="submit">
                        {isUploadingPhoto ? "uploading..." : "submit"}
                      </button>
                      <button onClick={() => setProfileImage("")}>
                        cancel
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
        <div className="profile_nav">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Posts" value="1" />
                  <Tab label={`Followers: ${follower.length}`} value="2" />
                  <Tab label={`Followers: ${following.length}`}  value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div>
                  {profilePost.map((post) => (
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
                  <div className="NoPost">
                    {profilePost.length == 0 && <p>No post to show </p>}
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2">
                {follower.map((follower, index) => (
                  <div className="followUser" key={`${index}123$$`}>
                    <Link to={`/profile/${follower?.data()?.uid}`}>
                      <User
                        photo={follower?.data()?.photoURL}
                        username={follower?.data()?.username}
                        email={follower?.data()?.email}
                      />
                    </Link>
                  </div>
                ))}
              </TabPanel>
              <TabPanel value="3">
                {following.map((follower, index) => (
                  <div className="followUser" key={`${index}1$$`}>
                    <Link to={`/profile/${follower?.data()?.uid}`}>
                      <User
                        photo={follower?.data()?.photoURL}
                        username={follower?.data()?.username}
                        email={follower?.data()?.email}
                      />
                    </Link>
                  </div>
                ))}
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Profile;
