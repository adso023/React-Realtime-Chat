import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import ChatList from "./pages/ChatList";
import Login from "./pages/Login";
import NewMessage from "./pages/NewMessage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignupPage from "./pages/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/new" element={<NewMessage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account-settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
