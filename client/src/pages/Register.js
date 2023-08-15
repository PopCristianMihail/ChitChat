import { React, useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

import { registerRoute } from "../ServerRoutes";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { username, email, password, passwordCheck } = inputs;
    const error = (() => {
      if (!username || !email || !password || !passwordCheck) {
        return "Please fill in all the fields";
      }
      if (username.length < 4 || username.length > 50) {
        return "Username must be between 3 and 20 characters long";
      }
      if (email.length < 8 || email.length > 30) {
        return "Email must be between 8 and 30 characters long";
      }
      if (password.length < 8 || password.length > 30) {
        return "Password must have 8 characters or more";
      }
      if (passwordCheck !== password) {
        return "Passwords don't match";
      }
      return undefined;
    })();

    if (error) toast.error(error, {
      position: "top-right",
      autoClose: 2000,
      draggable: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true,
      theme: "dark",
    });
    return !error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;
  
    const { username, email, password } = inputs;
    const { data } = await axios.post(registerRoute, {
      username,
      email,
      password,
    });

    if (!data.status) {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      return;
    }

    sessionStorage.setItem("ChitChatUser", JSON.stringify(data.newUser));
    navigate("/profilePicture");
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("ChitChatUser"));
    if (user) navigate("/");
  }, [navigate]);

  return (
    <main>
      <div className="loginForm">
        <div className="formWrapper">
          <span className="logo">📫ChitChat📬</span>
          <span className="title">Register</span>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name:"
              className="forInput"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="E-mail:"
              className="forInput"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password:"
              className="forInput"
              name="password"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password:"
              className="forInput"
              name="passwordCheck"
              onChange={handleChange}
            />
            <button>Sign Up</button>
          </form>
          <p>
            Already have an account ?
            <Link to="/login">
              <span className="linkJosDinForm">Login</span>
            </Link>
          </p>
        </div>
        <ToastContainer toastStyle={{ backgroundColor: "#1B262C", color: "f5f5f5" }} />
      </div>
    </main>
  );
};

export default Register;
