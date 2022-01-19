import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import ChatList from "./pages/Dashboard/ChatList";
import Login from "./pages/AuthPage/Login";
import NewMessage from "./pages/NewMessagePage/NewMessage";
import Profile from "./pages/UserDashboard/Profile";
import Settings from "./pages/UserDashboard/Settings";
import SignupPage from "./pages/AuthPage/Signup";

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
