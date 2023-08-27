import { React, useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { io } from "socket.io-client";

import { getUsersRoute, host, deleteConversationRoute } from "../ServerRoutes";

import { Navbar, Chats, Messages } from "../components";
import BinImage from "../images/bin.png";

import "../styles.scss";

// const ChatInfo = ({ username, profilePicture, onDeleteConversation }) => {
//   if (!username) return <div className="chatInfo noChatSelected" />;

//   return (
//     <div className="chatInfo">
//       <span>
//         <img src={profilePicture} alt="" />
//         {username}
//       </span>
//       <div className="chatIcons">
//         <img src={BinImage} alt="" onClick={onDeleteConversation} />
//       </div>
//     </div>
//   )
// }

const Home = () => {
  const navigate = useNavigate();

  const socket = useRef();

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [pictureClicked, setPictureClicked] = useState(false);

  const handleChange = async (chat) => {
    setSelectedContact(chat);
  };

  const handleDeleteConversation = async () => {
    const answer = window.confirm("Are you sure you want to delete this conversation?");
    if (!answer) return;
     
    const response = await axios.post(`${deleteConversationRoute}`, {
      sender: currentUser._id,
      receiver: selectedContact._id,
    });

    if (response.data.status) setSelectedContact({});
  };

  const handlePictureClick = () => {
    setPictureClicked(!pictureClicked);
    console.log(pictureClicked);
  }


  useEffect(() => {
    if (!currentUser) return;
  
    socket.current = io(host);
    socket.current.emit("join", currentUser._id);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser._id) return;

    (async () => {
      const response = await axios.get(`${getUsersRoute}/${currentUser._id}`);
      setContacts(response.data);
    })();
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      if (!sessionStorage.getItem("ChitChatUser")) {
        navigate("/login"); 
        return;
      }
      
      setCurrentUser(JSON.parse(sessionStorage.getItem("ChitChatUser")));
    })();
  }, [navigate]);

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
        <>
        {selectedContact.username ? (
          <div className="chatInfo">
            <span>
              <img className={`${pictureClicked ? "clickedSelectedContactPicture" : ""}`} src={selectedContact.profilePicture} alt="" onClick={handlePictureClick}/>
                {selectedContact.username}
            </span>
            <div className="chatIcons">
              <img src={BinImage} alt="" onClick={handleDeleteConversation} />
            </div>
          </div>
        ) : (
          <div className="chatInfo noChatSelected" />
        )
        }
        </>
          <Messages
            selectedContact={selectedContact}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
