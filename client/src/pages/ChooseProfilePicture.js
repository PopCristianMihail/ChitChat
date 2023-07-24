import { React, useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { profilePictureRoute } from "../ServerRoutes";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Image from "../images/user.png";

import imageCompression from "browser-image-compression";

import { Suspense } from "../components";

import "../styles.scss";

const LoadingSkeleton = () => (
  <div className="profilePicturePage">
    <div className="container">
      <div className="avatarSelection">
        <h1>Finishing up your account</h1>
        {/* <img src={LoadingAnimation} alt="" /> */}
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
)

function ChooseProfilePicture() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputFile = useRef(null);

  const handleFileChange = async () => {
    if (inputFile.current.files.length === 0) {
      // in case someone cancels the file browser
      setPhoto(photo ?? Image);
      return;
    }
    
    const file = inputFile.current.files[0];
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };

    try {
      const reader = new FileReader();
      const compressedFile = await imageCompression(file, options);

      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = async () => {
    if (!inputFile.current) return;
    inputFile.current.click();
  };

  const handleSkipButton = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setPhoto(Image);

    const user = JSON.parse(sessionStorage.getItem("ChitChatUser"));
    const { data } = await axios.post(`${profilePictureRoute}/${user._id}`, {
      profilePicture: photo ?? Image,
    });
    if (data.isSet) {
      user.isProfilePictureSet = true;
      user.profilePicture = photo ?? Image;

      sessionStorage.setItem("ChitChatUser", JSON.stringify(user));

      setIsLoading(false);
      navigate("/");
    }
  };

  const handleFinishButton = async (e) => {
    e.preventDefault();

    const toastErrorStyles = {
      position: "top-right",
      autoClose: 5000,
      draggable: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      theme: "dark",
    }

    if (!photo) {
      toast.error(
        "Please choose a profile picture to finish the registration or hit the Skip button if you don't want a profile picture!",
        toastErrorStyles
      );
      return;
    } 

    setIsLoading(true);

    const user = await JSON.parse(sessionStorage.getItem("ChitChatUser"));
    const { data } = await axios.post(`${profilePictureRoute}/${user._id}`, {
      profilePicture: photo ?? Image,
    });

    if (!data.isSet) {
      toast.error("Something went wrong, please try again!", toastErrorStyles);
      setIsLoading(false);
      return;
    }  

    user.isProfilePictureSet = true;
    user.profilePicture = photo ?? Image;

    sessionStorage.setItem("ChitChatUser", JSON.stringify(user));

    setIsLoading(false);
    navigate("/");
  };

  return (
    <Suspense loading={isLoading} fallback={() => <LoadingSkeleton />}>
      <div className="profilePicturePage">
        <div className="container">
          <div className="avatarSelection">
            <h1>Choose a profile picture</h1>
            <img src={photo ?? Image} alt="" />
            <input
              type="file"
              ref={inputFile}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className="choosePictureButton"
              onClick={handleClick}
            >
              Choose a profile picture
            </button>
          </div>
          <div className="footer">
            <button className="skipPictureButton" onClick={handleSkipButton}>
              Skip
            </button>
            <button
              className="finishPictureButton"
              onClick={handleFinishButton}
            >
              Finish
            </button>
          </div>
        </div>
        <ToastContainer toastStyle={{ backgroundColor: "#1B262C", color: "f5f5f5" }} />
      </div>
    </Suspense>
  );
}

export default ChooseProfilePicture;
