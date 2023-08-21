import React, { useState, useRef } from "react";
import axios from "axios";
import {
  logOutRoute,
  changeProfilePictureRoute,
  changeUsernameRoute,
  deleteAccountRoute,
} from "../ServerRoutes";
import imageCompression from "browser-image-compression";

function SettingsMenu({ isOpen, currentUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const inputFile = useRef(null);

  const handleLogOut = async () => {
    setIsLoading(true);

    const user = await JSON.parse(sessionStorage.getItem("ChitChatUser"));
    const id = user._id;
    const response = await axios.get(`${logOutRoute}/${id}`);

    if (response.status) {
      sessionStorage.removeItem("ChitChatUser");
      window.location.reload();
    }
  };

  const handlePictureChange = async () => {
    if (inputFile.current.files.length === 0) return; 

    const file = inputFile.current.files[0];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);
    const reader = new FileReader();

    reader.readAsDataURL(compressedFile);
    reader.onloadend = async () => {
      const profilePicture = reader.result;
      const response = await axios
        .post(`${changeProfilePictureRoute}/${currentUser._id}`, {
          profilePicture,
          id: currentUser._id,
        })
      
      const { data } = response;
      if (!data.isSet) return;
      
      currentUser.profilePicture = profilePicture;
      sessionStorage.setItem(
        "ChitChatUser",
        JSON.stringify(currentUser)
      );
      window.location.reload();
    };
  }

  const handleProfilePictureChange = () => inputFile.current.click();

  const handleChangeUsername = async () => {
    let newUsername = prompt("Enter new username");

    if (newUsername === null) return;
    if (newUsername === "") return;
    
    while (
      newUsername === currentUser.username ||
      newUsername.length < 3 ||
      newUsername.length > 20
    ) {
      alert(
        "Username must be between 3 and 20 characters long and must be different from your current username"
      );
      newUsername = prompt("Enter new username");
      if (newUsername === null) return;
      if (newUsername === "") return;
      
      handleChangeUsername();
    }
    if (!newUsername) return;

    await axios.post(`${changeUsernameRoute}/${currentUser._id}`, {
      newUsername: newUsername,
    })
    
    currentUser.username = newUsername;
    sessionStorage.setItem("ChitChatUser", JSON.stringify(currentUser));
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    const answer = window.confirm("Are you sure you want to delete your account?");
    if (!answer) return;
    
    const response = await axios.delete(`${deleteAccountRoute}/${currentUser._id}`);
    if (response.data.status) {
      sessionStorage.removeItem("ChitChatUser");
      window.location.reload();
    }
  }
  return (
    <>
      <div className={`dropDownMenuContainer ${isOpen ? "active" : ""}`}>
        <ul className="dropDownMenu">
          <li
            className="dropDownMenuOption"
            onClick={handleProfilePictureChange}
          >
            Change Profile Picture
            <input
              type="file"
              style={{ display: "none" }}
              ref={inputFile}
              accept="image/*"
              onChange={handlePictureChange}
            />
          </li>
          <li className="dropDownMenuOption" onClick={handleChangeUsername}>
            Change Username
          </li>
          {!isLoading ? (
            <li className="dropDownMenuOption" onClick={handleLogOut}>
              Log Out
            </li>
          ) : (
            <li className="dropDownMenuOption">
              <span className="loader"></span>
            </li>
          )}
          <li className="dropDownMenuOption" onClick={handleDeleteAccount}>
            Delete Account
          </li>
        </ul>
      </div>
    </>
  );
}

export default SettingsMenu;
