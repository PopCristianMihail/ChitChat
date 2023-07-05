import React from "react";
import Input from "./Input";
import axios from "axios";
import { getMessagesRoute, getFollowerRoute } from "../ServerRoutes";
import { useEffect, useState } from "react";
import { sendMessageRoute } from "../ServerRoutes";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";

const Messages = ({ selectedContact, socket }) => {
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    const fetchMessages = async () => {
      const currentUser = await JSON.parse(
        sessionStorage.getItem("ChitChatUser")
      );
      const response = await axios.post(getMessagesRoute, {
        sender: currentUser._id,
        receiver: selectedContact._id,
      });
      setMessages(response.data);
    };
    fetchMessages();
  }, [selectedContact._id]);

  const handleSendMessage = async (mess) => {
    const currentUser = await JSON.parse(
      sessionStorage.getItem("ChitChatUser")
    );
    const followerIdResponse = await axios
      .get(`${getFollowerRoute}/${currentUser._id}`)
      .catch((err) => {
        console.log(err);
        return null;
      });
    const followerId = followerIdResponse?.data?.id;
    socket.current.emit("sendMessage", {
      sender: currentUser._id,
      receiver: followerId,
      message: mess,
    });
    await axios.post(sendMessageRoute, {
      sender: currentUser._id,
      receiver: followerId,
      message: mess,
    });
    setMessages([
      ...messages,
      {
        fromCurrentUser: true,
        message: mess,
      },
    ]);
  };

  useEffect(() => {
    (async () => {
      if (socket.current) {
        socket.current.on("getMessage", (data) => {
          setLastMessage({ fromCurrentUser: false, message: data.message });
        });
      }
    })();
  });

  useEffect(() => {
    if (lastMessage)
      setMessages((prevMessage) => [...prevMessage, lastMessage]);
    // if lastMessage is not null, then add it to the messages array
  }, [lastMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const displayMessagesIfContactSelected = () => {
    if (selectedContact.username) {
      return (
        <>
          <div className="messages">
            {messages.map((message) => {
              return (
                <div
                  key={uuidv4()}
                  ref={scrollRef}
                  className={`message ${
                    message.fromCurrentUser ? "owner" : "receiver "
                  }`}
                >
                  <div className="messageContent">
                    {message.message.includes("data:image") ? (
                      <img src={message.message} alt="" />
                    ) : (
                      <p>{message.message}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Input handleSendMessage={handleSendMessage} />
        </>
      );
    } else {
      return (
        <>
          <div className="messages noChatSelected">
            <h2>Select a contact to start chatting</h2>
          </div>
        </>
      );
    }
  };

  return <>{displayMessagesIfContactSelected()}</>;
};
export default Messages;
