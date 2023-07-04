import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUsersRoute, host, deleteConversationRoute } from "../ServerRoutes";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles.scss";
import Navbar from "../components/Navbar";
import Chats from "../components/Chats";
import Bin from "../images/bin.png";
import Messages from "../components/Messages";

const Home = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!sessionStorage.getItem("ChitChatUser")) {
        navigate("/login");
      } else {
        const user = await JSON.parse(sessionStorage.getItem("ChitChatUser"));
        setCurrentUser(user);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  //useRef for socket

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("join", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await axios.get(`${getUsersRoute}/${currentUser._id}`);
      setContacts(response.data);
    };
    fetchContacts();
  }, [currentUser]);

  const handleChange = (chat) => {
    setSelectedContact(chat);
  };

  const handleDeleteConversationButton = async () => {
    const answer = window.confirm(
      "Are you sure you want to delete this conversation?"
    );
    if (answer === true) {
      const response = await axios.post(`${deleteConversationRoute}`, {
        sender: currentUser._id,
        receiver: selectedContact._id,
      });
      if (response.data.status) {
        setSelectedContact({});
      }
    } else {
      return;
    }
  };

  const chatInfoHandler = () => {
    if (selectedContact.username) {
      return (
        <div className="chatInfo">
          <span>
            <img src={selectedContact.profilePicture} alt="" />
            {selectedContact.username}
          </span>
          <div className="chatIcons">
            <img src={Bin} alt="" onClick={handleDeleteConversationButton} />
          </div>
        </div>
      );
    } else {
      return <div className="chatInfo noChatSelected"></div>;
    }
  };

  return (
    <div className="home">
      <div className="container">
        <div className="sidebar">
          <Navbar currentUser={currentUser} />
          <Chats
            contacts={contacts}
            changeCurrentSelectedContact={handleChange}
          />
        </div>
        <div
          className={`chat ${selectedContact.username ? "" : "noChatSelected"}`}
        >
          {chatInfoHandler()}
          <Messages selectedContact={selectedContact} socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default Home;
