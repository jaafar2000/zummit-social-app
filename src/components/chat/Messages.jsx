import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import Message from "./Message";
import {RiWechatFill} from "react-icons/ri"


const Messages = () => {
  const [messages, setMessages] = useState();
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {  
      
      messages ? 
      messages.map((m) => (
        <Message message={m} key={m.id} />
      ))
      : (
        <p className="no_msg" >
          <h1>OurApp <RiWechatFill style={{color : "#fff"}} /></h1>
          <h3>chat with your friends you can send msgs and photo.</h3>
          <p style={{textAlign:"center"}} >you can search for users on the top left of your screen, or check out user's profile then click on chat button .</p>
        </p>
      )
      
      }
    </div>
  )
}

export default Messages