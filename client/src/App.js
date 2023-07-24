import { Routes, Route, BrowserRouter } from "react-router-dom";

import { Home, Login, Register, ChooseProfilePicture } from './pages';

import "./styles.scss";

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
