import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { registerRoute } from "../ServerRoutes";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
  });
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("ChitChatUser"));
    if (user) {
      navigate("/");
    }
  }, [navigate]);
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleValidation = () => {
    const { username, email, password, passwordCheck } = inputs;
    if (!username || !email || !password || !passwordCheck) {
      toast.error("Please fill in all the fields", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      return false;
    } else if (username.length < 4 || username.length > 50) {
      toast.error("Username must be between 3 and 20 characters long", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      return false;
    } else if (email.length < 8 || email.length > 30) {
      toast.error("Email must be between 8 and 30 characters long", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      return false;
    } else if (password.length < 8 || password.length > 30) {
      toast.error("Password must have 8 characters or more", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      return false;
    } else if (passwordCheck !== password) {
      toast.error("Passwords don't match", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = inputs;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      if (data.status === false) {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 2000,
          draggable: true,
          pauseOnHover: true,
          pauseOnFocusLoss: true,
          theme: "dark",
        });
      }
      if (data.status === true) {
        sessionStorage.setItem("ChitChatUser", JSON.stringify(data.newUser));
        navigate("/profilePicture");
      }
    }
  };

  return (
    <main>
      <div className="loginForm">
        <div className="formWrapper">
          <span className="logo">📫ChitChat📬</span>
          <span className="title">Register</span>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              placeholder="Name:"
              className="forInput"
              name="username"
              onChange={(e) => handleChange(e)}
            ></input>
            <input
              type="email"
              placeholder="E-mail:"
              className="forInput"
              name="email"
              onChange={(e) => handleChange(e)}
            ></input>
            <input
              type="password"
              placeholder="Password:"
              className="forInput"
              name="password"
              onChange={(e) => handleChange(e)}
            ></input>
            <input
              type="password"
              placeholder="Confirm Password:"
              className="forInput"
              name="passwordCheck"
              onChange={(e) => handleChange(e)}
            ></input>
            <button>Sign Up</button>
          </form>
          <p>
            Already have an account ?
            <Link to="/login">
              <span className="linkJosDinForm">Login</span>
            </Link>
          </p>
        </div>
        <ToastContainer
          toastStyle={{ backgroundColor: "#1B262C", color: "f5f5f5" }}
        />
      </div>
    </main>
  );
};

export default Register;
