// src/components/Navbar.tsx
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Assuming useUser is the hook from your UserContext
import { auth } from "../auth/firebaseConfig"; // Make sure to import your Firebase auth
import { gql, useQuery } from "@apollo/client";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import insta from '../assets/insta.png';


const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      profilePicture
      bio
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
  const location = useLocation();


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
      setAnchorEl(null);
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

  const styledProgress = () => {
    return (
      <>
      <div className="absolute left-0 right-0 bottom-0 h-[2px] overflow-hidden">
            <div 
                className="absolute w-1/2 h-full bg-gradient-to-r from-transparent via-gray-300 to-transparent 
                           animate-laser opacity-70 blur-sm"
            >
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent 
                               animate-laser-reflect opacity-50 mix-blend-screen"
                ></div>
            </div>
        </div>
        <style>{`
            @keyframes laser {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
            
            .animate-laser {
                animation: laser 3s linear infinite;
            }
            
            .animate-laser-reflect {
                animation: laser 3s linear infinite;
                animation-delay: 0.5s;
            }
        `}</style>
        </>
    )
  }

  if (location.pathname === '/signup' || location.pathname === '/login') {
    return (
      <nav 
        className="bg-white/50 backdrop-blur-xl"
        style={{ 
          padding: "10px", 
          color: "black",
          backgroundImage: `url(${location.pathname === '/signup' ? 'https://i.pinimg.com/1200x/42/43/e1/4243e170920d95f50c92ad35531e3248.jpg' : 'https://i.pinimg.com/736x/a6/60/6c/a6606cb24d4d631234a2c31f63012643.jpg'})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex justify-start items-center">
        {styledProgress()}
          <Link to="/">
            <img 
              src={insta}
              alt="Logo" 
              className="h-10 w-auto"
            />
          </Link>
          <div style={{
                background:
                  "repeating-linear-gradient(135deg, #F58529, #DD2A7B, #8134AF 50%, #515BD4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>
          <p className="font-semibold text-xl" style={{ 
                  fontFamily: "'Montserrat', sans-serif" 
                }}>Quick Connect</p>
                </div>
        </div>
      </nav>
    )
  }


  return (
    <nav style={{ padding: "10px", color: "black" ,
      backgroundImage: `url('https://i.pinimg.com/736x/a5/a3/27/a5a3271b71a1103bd2e02373e80b099b.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
    }} className="bg-white/50 backdrop-blur-xl">
      {styledProgress()}
      <ul style={{ display: "flex", justifyContent: "space-between", listStyleType: "none", margin: 0, padding: 0 }}>
      <div className="flex justify-end items-center">
          <Link to="/">
            <img 
              src={insta}
              alt="Logo" 
              className="h-10 w-auto"
            />
          </Link>
          <div style={{
                background:
                  "repeating-linear-gradient(135deg, #F58529, #DD2A7B, #8134AF 50%, #515BD4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>
          <p className="font-semibold text-xl" style={{ 
                  fontFamily: "'Montserrat', sans-serif" 
                }}>Quick Connect</p>
                </div>
        </div>

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
        <p>Welcome, {user?.displayName}</p>
              <button onClick={handleLogout} style={{ padding: "5px 10px", backgroundColor: "red", color: "#fff", border: "none", cursor: "pointer" }}>
                Logout
              </button>
            </Typography>
      </Popover>
    </div>

        {/* Conditional rendering: If user is logged in, show their name and logout button */}
        {user ? (
          <>
            <div className="flex gap-x-8 items-center font-semibold" 
            style={{
              background:
                "repeating-linear-gradient(135deg, #79cf8c, #00bbb9 50%, #8080ea)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              // display: "inline-block",
            }}
            >
            <li>
          <Link to="/newsfeed" className="text-lg" style={{ textDecoration: "none", color:'black' }}>NewsFeed</Link>
        </li>
            <button onClick={handleClick}>
              { profPic && <img src={`data:${profPic}`} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />}
              { !profPic && <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />}
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
