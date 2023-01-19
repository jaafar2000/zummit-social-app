import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { ChatContext } from "../../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { AiOutlineSend } from "react-icons/ai";
import { db } from "../../firebase";
import { storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { RiAttachment2 } from "react-icons/ri";
import { FaHourglassEnd   } from "react-icons/fa"
const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [send , setSend] = useState(false)
  const { currentUser } = useContext(UserContext);
  const { data } = useContext(ChatContext);

  const handleSend = async (e) => {
    
    e.preventDefault();
    setSend(true)
    if (img) {
      const storageRef = ref(storage, uuid());
      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser?.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser?.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser?.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
    setSend(false)
  };

  return (
    <div className="input">
      <form onSubmit={(e) => handleSend(e)}>
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="send">
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label className="lable" htmlFor="file">
            <i>
              <RiAttachment2 style={{ color: "#fff" }} />
            </i>
            {img && (
              <img className="img_tosend" alt="img" src={URL.createObjectURL(img)} />
            )}
          </label>
          <button>
            {
              send ?  <FaHourglassEnd/>   :         <AiOutlineSend />

            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default Input;
