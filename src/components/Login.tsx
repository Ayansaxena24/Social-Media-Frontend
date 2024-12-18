import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "../context/UserContext";
import { gql, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { TextField } from "@mui/material";
import { User } from "../type/Types";
// import { Eye, EyeOff } from "lucide-react";

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

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedSignIn, setClickedSignIn] = useState(false);
  const { user } = useUser();
  const { 
    data: userData,
    loading: userLoading,
    error: userError, } = useQuery(GET_USERS);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      setClickedSignIn(true);
      setTimeout(() => navigate("/newsfeed"), 800); // Redirect to newsfeed after a delay
    } catch (error : any) {
      const errorMessage = error.message.includes("invalid-credential")
        ? "Invalid email or password. Please try again."
        : error.message;
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!clickedSignIn && user && userData?.users?.length > 1 && userData.users.find((item : User) => item.email === user.email)) {
      console.log(userData?.users?.length, "userData?.users?.length");
      alert("Already signed in. Please log out to log in with a new account.");
      toast.success("Already signed in. Redirecting to newsfeed...");
      setTimeout(() => navigate("/newsfeed"), 800);
    }
    
  }, [user]);

  useEffect(() => {
    // Reset email and password on component mount
    setEmail('');
    setPassword('');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    style={{
      backgroundImage: `url('https://i.pinimg.com/736x/a6/60/6c/a6606cb24d4d631234a2c31f63012643.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "top",
      backgroundRepeat: "no-repeat",
    }}
    >
      <ToastContainer autoClose={700}/>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-8 bg-white/30 backdrop-blur-xl shadow-md rounded-xl p-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a 
            data-testid="createAccountButton"
              href="/signup" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </a>
          </p>
        </div>
        <form 
          className="mt-8 space-y-6" 
          onSubmit={handleLogin}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <TextField
                id="email"
                type="email"
                InputLabelProps={{ shrink: true }}
                label="Email"
                required
                data-testid='email123'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                InputLabelProps={{ shrink: true }}
                data-testid='password123'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                disabled={isLoading}
                data-testid="eye"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;