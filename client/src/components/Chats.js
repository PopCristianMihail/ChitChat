import React from "react";
import { useState, useEffect } from "react";

import { Suspense } from '.';

const Contact = ({ className, onContactChange, contact }) => ( 
  <div
    key={contact._id}
    className={className}
    onClick={() => onContactChange(contact)}
  >
    <img src={contact.profilePicture} alt="" />
    <div className="userChatInfo">
      <span>{contact.username}</span>
    </div>
  </div>
)

const Chats = ({ contacts, changeCurrentSelectedContact }) => {
  const [currentContact, setCurrentContact] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const handleContactChange = index => contact => {
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
    if (contacts.length > 0) setIsLoading(false);
  }, [contacts]);

  useEffect(() => {
    document.addEventListener("keydown", escPressed, false);
    return () => {
      document.removeEventListener("keydown", escPressed, false);
    };
  });


  return (
    <Suspense loading={isLoading} fallback={() => (
        <div className="chatsContainer onLoading">
          <span className="loader"></span>
        </div>
    )}>
      <div className="chatsContainer">{
        contacts.map((contact, index) => (
          <Contact
            contact={contact}
            key={index}
            className={`userChat ${index === currentContact ? "active" : ""}`}
            onContactChange={handleContactChange(index)}
          />
        ))}
      </div>
    </Suspense>
  );
};

export default Chats;
