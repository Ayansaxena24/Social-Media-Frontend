import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../auth/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Eye, EyeOff, Camera } from "lucide-react";
import { TextField } from "@mui/material";

// GraphQL Mutation for user sign up
const SIGN_UP_USER = gql`
  mutation SignUpUser(
    $username: String!
    $email: String!
    $profilePicture: String!
    $bio: String!
  ) {
    signUp(
      username: $username
      email: $email
      profilePicture: $profilePicture
      bio: $bio
    ) {
      id
      username
      email
      profilePicture
      bio
    }
  }
`;

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

const Signup: React.FC = () => {
  const { user } = useUser();
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USERS);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // State for profile picture
  const navigate = useNavigate();
  const [signUpUser] = useMutation(SIGN_UP_USER);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCameraIconClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (user && userData?.users?.length < 4) {
      console.log(userData?.users?.length, "userData?.users?.length");
      navigate("/"); // Redirect to home if user is already logged in
    }
  }, [user]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Update profile with display name
      await updateProfile(firebaseUser, { displayName });

      // Store user data in the Apollo Server
      await signUpUser({
        variables: {
          username: displayName,
          email: email,
          profilePicture: imageUrl,
          bio: bio,
        },
      });

      navigate("/newsfeed");
    } catch (err: any) {
      let errorMessage = "An error occurred during signup";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; // Ensure a file was selected

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result); // Safely assign only if result is a string
      } else {
        console.error("FileReader result is not a string");
      }
    };

    console.log(imageUrl, "imageUrl");

    reader.readAsDataURL(file); // Start reading the file as Base64
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative"
      style={{
        backgroundImage: `url('https://i.pinimg.com/1200x/42/43/e1/4243e170920d95f50c92ad35531e3248.jpg')`,
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
              data-testid = "signInButton"
            >
              Sign in
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Display Name Input */}
            <div className="relative">
              <TextField
                id="displayName"
                type="text"
                data-testid = "displayName"
                label="Display Name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Display Name"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <TextField
                id="email"
                label="Email Address"
                type="email"
                data-testid = "email123"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <TextField
                id="bio"
                label="Bio"
                type="bio"
                autoComplete="bio"
                required
                data-testid="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Add a bio"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <TextField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                data-testid="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-md relative block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {!imageUrl &&
            <div className="relative flex items-center">
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <p className="opacity-0">jg</p>
            <div
            data-testid="imageButton"
              onClick={handleCameraIconClick}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <Camera size={24} className="text-gray-500" />
            </div>
            </div>
            }
            <div className="flex justify-center items-center relative">
            {imageUrl &&
            <><img src={imageUrl} alt="Preview" width="200" className="relative"/>
            <button className="absolute -top-1 right-20 text-white" onClick={() => setImageUrl('')}>x</button>
          </>}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              data-testid="submitButton"
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <span className="animate-pulse">Creating account...</span>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
