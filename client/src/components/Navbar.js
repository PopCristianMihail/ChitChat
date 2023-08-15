import React from "react";
import { useState, useRef } from "react";
import SettingsMenu from "./SettingsMenu";
import settings from "../images/settings.png";

const Navbar = ({ currentUser }) => {
  const inputFile = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clickedProfilePicture, setClickedProfilePicture] = useState(false);

  const handleSettingsClick = () => {
    setIsOpen(!isOpen);
  };

  const handleProfilePictureClick = () => {
    setClickedProfilePicture(!clickedProfilePicture);
  };

  return (
    <div className="navbar">
      <span className="userImage">
        <img
          className={`${clickedProfilePicture ? "clicked" : ""}`}
          src={currentUser.profilePicture}
          alt=""
          onClick={handleProfilePictureClick}
        />
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputFile}
          accept="image/*"
        />
      </span>
      <div className="user">
        <h3>{currentUser.username}</h3>
        <img
          className={`${isOpen ? "rotate" : ""}`}
          src={settings}
          alt=""
          onClick={handleSettingsClick}
        />
        <SettingsMenu isOpen={isOpen} currentUser={currentUser} />
      </div>
    </div>
  );
};
export default Navbar;