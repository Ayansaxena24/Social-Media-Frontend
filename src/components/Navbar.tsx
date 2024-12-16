// src/components/Navbar.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Assuming useUser is the hook from your UserContext
import { auth } from "../auth/firebaseConfig"; // Make sure to import your Firebase auth
import { gql, useQuery } from "@apollo/client";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);


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

  }, [user]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  return (
    <nav style={{ padding: "10px", backgroundColor: "#333", color: "#fff" }}>
      <ul style={{ display: "flex", justifyContent: "space-between", listStyleType: "none", margin: 0, padding: 0 }}>
        <li>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
        </li>
        <li>
          <Link to="/newsfeed" style={{ color: "#fff", textDecoration: "none" }}>NewsFeed</Link>
        </li>

        <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>
              <button onClick={handleLogout} style={{ padding: "5px 10px", backgroundColor: "red", color: "#fff", border: "none", cursor: "pointer" }}>
                Logout
              </button>
            </Typography>
      </Popover>
    </div>

        {/* Conditional rendering: If user is logged in, show their name and logout button */}
        {user ? (
          <>
            <div className="flex gap-x-4">
            <li style={{ color: "#fff" }}>Welcome, {user.displayName}</li>
            <button onClick={handleClick}>
              { profPic && <img src={`data:${profPic}`} style={{ width: "30px", height: "30px", borderRadius: "50%" }} />}
              { !profPic && <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />}
              </button>
            </div>
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
