import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { loginRoute } from "../ServerRoutes";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (sessionStorage.getItem("ChitChatUser")) {
      navigate("/");
    }
  }, [navigate]);
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const handleValidation = () => {
    const { email, password } = inputs;
    if (!email || !password) {
      toast.error("Please fill in all the fields", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
      return false;
    } else if (email.length < 8 || email.length > 50) {
      toast.error("Email must be between 8 and 50 characters long", {
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
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setIsLoading(true);
      const { email, password } = inputs;
      const { data } = await axios.post(loginRoute, { email, password });
      try {
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
          navigate("/");
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      {isLoading ? (
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
      ) : (
        <main>
          <div className="loginForm">
            <div className="formWrapper">
              <span className="logo">📫ChitChat 📬</span>
              <span className="title">Login</span>
              <form onSubmit={(e) => handleSubmit(e)}>
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
                <button>Login</button>
              </form>
              <p>
                You don't have an account ?
                <Link to="/register">
                  <span className="linkJosDinForm">Register</span>
                </Link>
              </p>
            </div>
            <ToastContainer
              toastStyle={{ backgroundColor: "#1B262C", color: "f5f5f5" }}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default Login;
