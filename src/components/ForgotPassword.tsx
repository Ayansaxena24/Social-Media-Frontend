import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      username
      profilePicture
      following
      followers
      bio
    }
  }
`;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { 
    data: userData,
    loading: userLoading,
    error: userError, } = useQuery(GET_USERS);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear previous messages
    if (userData?.users.find((user : User)=> user.email !== email)) {
      alert("No user found with this email address.");
      setIsLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after a delay
    } catch (error : any) {
      const errorMessage = error.message.includes("user-not-found")
        ? "No user found with this email address."
        : "Failed to send reset email. Please try again.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('https://i.pinimg.com/736x/a6/60/6c/a6606cb24d4d631234a2c31f63012643.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-8 bg-white/30 backdrop-blur-xl shadow-md rounded-xl p-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div
            className={`mt-4 text-center ${message.includes("sent") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
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
                <span className="animate-pulse">Sending...</span>
              ) : (
                "Send Reset Link"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
