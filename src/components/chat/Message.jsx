import React, { useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContect";
import { ChatContext } from "../../context/ChatContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import profileImg from "../../assets/profileImg.png"


const Message = ({ message }) => {



  TimeAgo.addLocale(en)
  const { currentUser } = useContext(UserContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  
  return (
    <div
    ref={ref}
    className={`message ${message.senderId == currentUser?.uid && "owner"}`}
  >
    <div className="messageInfo">
      <img
        src={
          message.senderId === currentUser?.uid
            ? currentUser.photoURL || profileImg
            : data.user.photoURL || profileImg
        }
        alt=""
      />

    </div>
    <div className="messageContent">
      {message.text && (
        <p>
          <span>{message.text}</span>
          <span>
            {new Date(message?.date?.seconds * 1000)
              .toLocaleString()
              .slice(11, 15)}
            -
            {new Date(message?.date?.seconds * 1000)
              .toLocaleString()
              .slice(19)}
          </span>
        </p>
      )}
      {message.img && (
        <>
          <div className="img">
              <img src={message?.img} alt="" />{" "}
              {!message.text && (
                <span>
                  {new Date(message?.date?.seconds * 1000)
                    .toLocaleString()
                    .slice(11, 15)}

                  {new Date(message?.date?.seconds * 1000)
                    .toLocaleString()
                    .slice(19)}
                </span>
              )}{" "}
          </div>

        </>
      )}
    </div>
  </div>
  )
}

export default Message