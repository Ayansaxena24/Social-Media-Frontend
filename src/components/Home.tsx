// src/pages/Home.tsx
import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Please log in first.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || "User"}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
