import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./styles.scss";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ChooseProfilePicture from "./pages/ChooseProfilePicture";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profilePicture" element={<ChooseProfilePicture />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
