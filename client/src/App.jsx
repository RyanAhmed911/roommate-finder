import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import HomePage from "./pages/home.jsx";
import RoomsPage from "./pages/rooms.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

