import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,

} from "firebase/firestore";
import { db } from "../../firebase";
import { UserContext } from "../../context/UserContext";
const Search = () => {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(UserContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    console.log(user)
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
    currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

        try {
          const res = await getDoc(doc(db, "chats", combinedId));
          if (!res.exists()) {
            //create chat in chats collection
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
            //create a user chat
            await updateDoc(doc(db, "userChats", currentUser?.uid), {
              [combinedId + ".userInfo"]: {
                uid: user?.uid,
                username: user?.username,
                photoURL : user?.photoURL ?user?.photoURL: null, 

              },
              [combinedId + ".date"]: {
                data: serverTimestamp(),
              },
            });
    
            await updateDoc(doc(db, "userChats", user[0]?.uid), {
              [combinedId + ".userInfo"]: {
                uid: currentUser?.uid,
                username: currentUser?.displayName,
                photoURL : currentUser?.photoURL ?currentUser?.photoURL: null, 

              },
              [combinedId + ".date"]: {
                data: serverTimestamp(),
              },
            });
          }
        } catch (err) {}

    setUser(null);
    setUsername("")
  };

  return (
        <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.username}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search