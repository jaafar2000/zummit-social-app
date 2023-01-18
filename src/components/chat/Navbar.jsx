import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContect'
import {RiWechatFill} from "react-icons/ri"

const Navbar = () => {
  const {currentUser} = useContext(UserContext)


  return (
    <div className='navbar'>
    <span className="logo">OurApp Chat<RiWechatFill/></span>
    <div className="user">
      {/* <img src={currentUser?.photoURL} alt="" /> */}
      <span>{currentUser?.username}</span>
    </div>
  </div>
  )
}

export default Navbar