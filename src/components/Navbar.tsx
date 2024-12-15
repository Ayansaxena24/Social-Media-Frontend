// src/components/Navbar.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Assuming useUser is the hook from your UserContext
import { auth } from "../auth/firebaseConfig"; // Make sure to import your Firebase auth
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      profilePicture
    }
  }
`;


const Navbar: React.FC = () => {
  const { user, setUser } = useUser(); // Get user data from context
  const [profPic, setProfPic] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USERS);

  const handleDp = () => {
    let dp = userData?.users.filter((item: any) => item.email === user?.email);
    if (dp) {
      setProfPic(dp[0]?.profilePicture);
      console.log(dp[0]?.profilePicture, "dp");
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user using Firebase auth
      setUser(null); // Clear user context
      navigate("/signup"); // Redirect to the signup page
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  console.log(userData, "userData");
  console.log(user, "user");
  useEffect(() => {
    handleDp();

  }, [userData, user]);

  useEffect(() => {
    handleDp();

  }, []);

  return (
    <nav style={{ padding: "10px", backgroundColor: "#333", color: "#fff" }}>
      <ul style={{ display: "flex", justifyContent: "space-between", listStyleType: "none", margin: 0, padding: 0 }}>
        <li>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
        </li>
        <li>
          <Link to="/newsfeed" style={{ color: "#fff", textDecoration: "none" }}>NewsFeed</Link>
        </li>

        {/* Conditional rendering: If user is logged in, show their name and logout button */}
        {user ? (
          <>
            <div className="flex gap-x-4">
            <li style={{ color: "#fff" }}>Welcome, {user.displayName}</li>
              { profPic && <img src={`data:${profPic}`} style={{ width: "30px", height: "30px", borderRadius: "50%" }} />}
            </div>
            <li>
              <button onClick={handleLogout} style={{ padding: "5px 10px", backgroundColor: "red", color: "#fff", border: "none", cursor: "pointer" }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/signup" style={{ color: "#fff", textDecoration: "none" }}>Sign Up</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
