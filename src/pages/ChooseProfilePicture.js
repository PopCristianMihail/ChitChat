import { React, useState, useRef } from "react";
import "../styles.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { profilePictureRoute } from "../ServerRoutes";
import Image from "../images/user.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";

function ChooseProfilePicture() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(Image);
  const [isloading, setIsLoading] = useState(false); // for loading animation
  const [selectedPhoto, setSelectedPhoto] = useState(false);
  const inputFile = useRef(null);
  const handleClick = async (e) => {
    inputFile.current.click();
    inputFile.current.onchange = async () => {
      console.log("onchange");
      if (inputFile.current.files.length === 0) {
        // in case someone cancels the file browser
        setPhoto(photo);
      } else {
        const file = inputFile.current.files[0];
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => {
            setPhoto(reader.result);
            setSelectedPhoto(true);
          };
        } catch (error) {
          console.log(error);
        }
      }
    };
  };
  const handleSkipButton = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPhoto(Image);
    const user = await JSON.parse(sessionStorage.getItem("ChitChatUser"));
    const { data } = await axios.post(`${profilePictureRoute}/${user._id}`, {
      profilePicture: photo,
    });
    if (data.isSet) {
      user.isProfilePictureSet = true;
      user.profilePicture = photo;
      sessionStorage.setItem("ChitChatUser", JSON.stringify(user));
      setIsLoading(false);
      navigate("/");
    }
  };
  const handleFinishButton = async (e) => {
    e.preventDefault();
    if (!selectedPhoto) {
      toast.error(
        "Please choose a profile picture to finish the registration or hit the Skip button if you don't want a profile picture!",
        {
          position: "top-right",
          autoClose: 5000,
          draggable: true,
          pauseOnHover: true,
          pauseOnFocusLoss: true,
          theme: "dark",
        }
      );
    } else {
      setIsLoading(true);
      const user = await JSON.parse(sessionStorage.getItem("ChitChatUser"));
      const { data } = await axios.post(`${profilePictureRoute}/${user._id}`, {
        profilePicture: photo,
      });
      if (data.isSet) {
        user.isProfilePictureSet = true;
        user.profilePicture = photo;
        sessionStorage.setItem("ChitChatUser", JSON.stringify(user));
        setIsLoading(false);
        navigate("/");
      } else {
        toast.error("Something went wrong, please try again!", {
          position: "top-right",
          autoClose: 5000,
          draggable: true,
          pauseOnHover: true,
          pauseOnFocusLoss: true,
          theme: "dark",
        });
      }
    }
  };

  return (
    <>
      {isloading ? (
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
      ) : (
        <div className="profilePicturePage">
          <div className="container">
            <div className="avatarSelection">
              <h1>Choose a profile picture</h1>
              <img src={photo} alt="" />
              <input
                type="file"
                ref={inputFile}
                style={{ display: "none" }}
                accept="image/*"
              />
              <button
                className="choosePictureButton"
                onClick={(e) => handleClick(e)}
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
          <ToastContainer
            toastStyle={{ backgroundColor: "#1B262C", color: "f5f5f5" }}
          />
        </div>
      )}
    </>
  );
}

export default ChooseProfilePicture;
