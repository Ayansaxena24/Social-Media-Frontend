import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext"; // Ensure correct imports
import Home from "./components/Home";
import Signup from "./components/Signup";
import NewsFeed from "./components/NewsFeed";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ForgotPassword from "./components/ForgotPassword";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/newsfeed" element={<NewsFeed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes: Check if user is logged in */}
          <Route
            path="/home"
            element={<ProtectedRoute><Home /></ProtectedRoute>}
          />
          <Route
            path="/newsfeed"
            element={<ProtectedRoute><NewsFeed /></ProtectedRoute>}
          />
          {/* Add other routes as necessary */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

// Protected Route to check if the user is logged in
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser(); // Get the user state from context

  // Redirect to signup page if user is not logged in
  if (!user) {
    return <Navigate to="/signup" />;
  }

  return <>{children}</>;
};

export default App;
