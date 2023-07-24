import React from "react";
import { useState, useEffect } from "react";

const Chats = ({ contacts, changeCurrentSelectedContact }) => {
  const [currentContact, setCurrentContact] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleContactChange = (index, contact) => {
    setCurrentContact(index);
    changeCurrentSelectedContact(contact);
  };

  const escPressed = (e) => {
    if (e.keyCode === 27) {
      handleContactChange({}, {});
      setCurrentContact(undefined);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escPressed, false);
    return () => {
      document.removeEventListener("keydown", escPressed, false);
    };
  });

  useEffect(() => {
    if (contacts.length > 0) {
      setIsLoading(false);
    }
  }, [contacts]);

  const renderContacts = () => {
    return contacts.map((contact, index) => {
      return (
        <div
          key={contact._id}
          className={`userChat ${index === currentContact ? "active" : ""}`}
          onClick={() => handleContactChange(index, contact)}
        >
          <img src={contact.profilePicture} alt="" />
          <div className="userChatInfo">
            <span>{contact.username}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="chatsContainer onLoading">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="chatsContainer">{renderContacts()}</div>
      )}
    </>
  );
};

export default Chats;
