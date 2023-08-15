import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

import Input from "./Input";
import { getMessagesRoute, sendMessageRoute } from "../ServerRoutes";

import { v4 as uuidv4 } from "uuid";

const SelectContact = () => ( 
  <div className="messages noChatSelected">
    <h2>Select a contact to start chatting</h2>
  </div>
)

const MessageContent = ({ message }) => {
  if (message.includes("data:image")) return <img src={message} alt="" />;
  return<p>{message}</p>
}

const Messages = ({ selectedContact, socket }) => {
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const scrollRef = useRef();
  
  const handleSendMessage = async (message) => {
    const currentUser = JSON.parse(sessionStorage.getItem("ChitChatUser"));
    const data = {
      sender: currentUser._id,
      receiver: selectedContact._id,
      message
    };

    socket.current.emit("sendMessage", data);
    await axios.post(sendMessageRoute, data);

    setMessages([
      ...messages,
      {
        fromCurrentUser: true,
        message: message,
      },
    ]);
  };
    
  useEffect(() => {
    (async () => {
      const currentUser = JSON.parse(sessionStorage.getItem("ChitChatUser"));
      const response = await axios.post(getMessagesRoute, {
        sender: currentUser._id,
        receiver: selectedContact._id,
      });
      setMessages(response.data);
    })();
  }, [selectedContact._id]);

  useEffect(() => {
    (async () => {
      if (!socket.current) return;
      
      socket.current.on("getMessage", ({ message }) => {
        setLastMessage({ fromCurrentUser: false, message });
      });
    })();
  });

  useEffect(() => {
    if (lastMessage) setMessages((prevMessage) => [...prevMessage, lastMessage]);
  }, [lastMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedContact.username) return <SelectContact />;

  return <>
    <div className="messages">
      {messages.map(({ fromCurrentUser, message }) => {
        return (
          <div
            key={uuidv4()}
            ref={scrollRef}
            className={`message ${fromCurrentUser ? "owner" : "receiver "}`}
          >
            <div className="messageContent">
              <MessageContent message={message} />
            </div>
          </div>
        );
      })}
    </div>
    <Input handleSendMessage={handleSendMessage} />
  </>;
};
export default Messages;
