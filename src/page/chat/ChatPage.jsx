import React from 'react'
import Chat from '../../components/chat/Chat'
import Sidebar from '../../components/chat/Sidebar'

import './style.scss'
const ChatPage = () => {
  return (
    <div className='chatHome'>
      <div className="chat_container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default ChatPage