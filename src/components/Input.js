import React from "react";
import { useState, useRef } from "react";
import Emoji from "../images/emoji.png";
import SendPicture from "../images/image.png";
import Send from "../images/sendArrow.png";
import "../styles.scss";
import imageCompression from "browser-image-compression";

const Input = ({ handleSendMessage }) => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const inputPicture = useRef(null);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim().length > 0) {
      setMessage(message);
      handleSendMessage(message);
      setMessage("");
    } else {
      setMessage("");
    }
  };

  const handleEnterKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleSend(e);
    }
  };

  const handlePickerClick = () => {
    setShowPicker(!showPicker);
    console.log(showPicker);
  };

  const handleSendPictureClick = () => {
    inputPicture.current.click();
    inputPicture.current.onchange = async () => {
      if (inputPicture.current.files.length === 0) {
        // in case someone cancels the file browser
      } else {
        const file = inputPicture.current.files[0];
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = async () => {
          handleSendMessage(reader.result);
        };
      }
    };
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={handleChange}
        onKeyDown={(e) => handleEnterKeyPressed(e)}
      />
      <div className="send">
        <img
          className="sendEmoji"
          src={Emoji}
          alt=""
          onClick={handlePickerClick}
        />
        <img
          className="sendEmoji"
          src={SendPicture}
          alt=""
          onClick={handleSendPictureClick}
        />
        <img
          className="sendArrow"
          src={Send}
          alt=""
          onClick={(e) => handleSend(e)}
        />
        <input
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          ref={inputPicture}
        />
      </div>
    </div>
  );
};

export default Input;
