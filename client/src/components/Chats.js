import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    if (contacts.length > 0) setIsLoading(false);
  }, [contacts]);

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
