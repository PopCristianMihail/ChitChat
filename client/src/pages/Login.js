import React, { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

import { loginRoute } from "../ServerRoutes";

import { Suspense } from '../components';

const LoadingSkeleton = () => (
  <div className="loginForm">
    <div className="formWrapper">
      <span className="logo">📫ChitChat 📬</span>
      <span className="title">Loading</span>
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
)

const Login = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { email, password } = inputs;
    const error = (() => {
      if (!email || !password) {
        return "Please fill in all the fields";
      }
      if (email.length < 8 || email.length > 50) {
        return "Email must be between 8 and 50 characters long";
      }
      if (password.length < 8 || password.length > 30) {
        return "Password must have 8 characters or more";
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

    return !error

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    const { email, password } = inputs;

    setIsLoading(true);
    const { data } = await axios.post(loginRoute, { email, password });

    if (!data.status) {
      toast.error(data.message, {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      setIsLoading(false);
      return;
    }

    sessionStorage.setItem("ChitChatUser", JSON.stringify(data.newUser));
    navigate("/");
    setIsLoading(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("ChitChatUser")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Suspense loading={isLoading} fallback={() => <LoadingSkeleton />}>
      <main>
        <div className="loginForm">
          <div className="formWrapper">
            <span className="logo">📫ChitChat 📬</span>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
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
              <button>Login</button>
            </form>
            <p>
              You don't have an account ?
              <Link to="/register">
                <span className="linkJosDinForm">Register</span>
              </Link>
            </p>
          </div>
          <ToastContainer toastStyle={{ backgroundColor: "#1B262C", color: "f5f5f5" }} />
        </div>
      </main>
    </Suspense>
  );
};

export default Login;
