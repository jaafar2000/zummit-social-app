import React from "react";
import Header from "../../components/Header/Header";
import { Routes, Route } from "react-router-dom";
import Feed from "../../components/feed/Feed";
import CreatePost from "../../components/CreatePost/CreatePost";
import Profile from "../../components/Profile/Profile";
import Footer from "../../components/Footer/Footer";
import ChatPage from "../chat/ChatPage";
const Home = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default Home;
