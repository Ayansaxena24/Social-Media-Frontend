import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import { Chip, Autocomplete, TextField } from '@mui/material';
import { useUser } from '../context/UserContext';
import { Camera } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Existing AddPost mutation
const ADD_POST = gql`
  mutation AddPost($content: String!, $author: String!, $mentions: [String!], $image: String!, $profilePicture: String!, $likes: Int!, $likedby: [ID!], $authorid: ID!) {  
    addPost(content: $content, author: $author, mentions: $mentions, image: $image, profilePicture: $profilePicture, likes: $likes, likedby: $likedby, authorid: $authorid) {
      id
      content
      author
      authorid
      mentions
      image
      profilePicture
      likes
      likedby
    }
  }
`;

// Query to fetch users (assuming this query exists in your GraphQL schema)
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

const AddPostForm: React.FC = () => {
  const [content, setContent] = useState("");
  const [mentions, setMentions] = useState<{id: string, displayname: string}[]>([]);
  const [addPost] = useMutation(ADD_POST);
  const [image, setImage] = useState(null);
  const [authorID, setAuthorID] = useState("");
  const [profPic, setProfPic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [availableUsers, setAvailableUsers] = useState<{id: string, displayname: string}[]>([]);
  const { user } = useUser();
  const { data: usersData } = useQuery(GET_USERS);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCameraIconClick = () => {
    fileInputRef.current?.click();
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
  
    reader.readAsDataURL(file); // Start reading the file as Base64
  };
  
  useEffect(() => {
    const handleDp = () => {
      let dp = usersData?.users.filter((item: any) => item.email === user?.email);
      if (dp) {
        setProfPic(dp[0]?.profilePicture);
        setAuthorID(dp[0]?.id);
        console.log(dp[0]?.id, "dp");
      }
    }
    handleDp();
  }, [usersData, user]);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(imageUrl, "asaasas")
    console.log(profPic, "asaasas2")
    try {
      await addPost({ 
        variables: { 
          content, 
          author: user?.displayName ?? "", 
          mentions: mentions.map(mention => mention.displayname) ,
          image: imageUrl,
          profilePicture: profPic,
          likes: 0,
          likedby: [],
          authorid: authorID
        } 
      });
      setContent("");
      setMentions([]);
      setImageUrl("");
      toast("Post added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding post:", error);
      alert(error);
    }
  };


  // Exclude current user and already mentioned users from the list
  useEffect(() => {

    const presentUserId = usersData?.users.find(
      (item: any) => item.email === user?.email
    )?.id;

    const availUsers = usersData?.users.filter(
      (u: {id: string, username: string}) => 
      u.id !== presentUserId && 
    !mentions.some(mention => mention.id === u.id)
  ) || [];
  setAvailableUsers(availUsers.map((u: {id: string, username: string}) => ({ id: u.id, displayname: u.username })));
})

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" bg-white shadow-md rounded-lg p-6"
    >      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='flex gap-x-4'>
        <div className='flex gap-x-4 items-start'>
        { profPic && <img src={`data:${profPic}`} style={{ width: "60px", height: "60px", borderRadius: "50%", border:'1px solid green' }} />}
        { !profPic && <img src={`https://cdn-icons-png.flaticon.com/512/149/149071.png`} style={{ width: "60px", height: "60px", borderRadius: "50%", border:'4px solid blue' }} />}
        </div>

        <div className='relative w-[100%]'>
          <textarea
            id="content"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
            required
            
          ></textarea>
          <input ref={fileInputRef} className='hidden' type="file" accept="image/*" onChange={handleImageUpload} />
          <div 
        onClick={handleCameraIconClick} 
        className="absolute bottom-4 right-6 cursor-pointer hover:opacity-70 transition-opacity"
      >
        <Camera size={24} className="text-gray-500" />
      </div>
          {imageUrl && <img src={imageUrl} alt="Preview" width="200" />}
        </div>
        </div>

        {/* <div>
          <Autocomplete
            multiple
            id="user-mentions"
            options={availableUsers}
            getOptionLabel={(option) => option.displayname}
            value={mentions}
            onChange={(_, newValue) => {
              setMentions(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  // key={option.id}
                  label={option.displayname}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={mentions}
                label="Mention Users"
                placeholder="Select users to mention"
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Select users to mention in your post
          </p>
        </div> */}
        <div className='flex justify-between w-[100%]'>
          <Autocomplete
            multiple
            id="user-mentions"
            options={availableUsers}
            getOptionLabel={(option) => option.displayname}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={mentions}
            className='w-[40%]'
            onChange={(_, newValue) => {
              setMentions(newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  // key={option.id}
                  label={option.displayname}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Mention Users"
                placeholder="Select users to mention"
              />
            )}
          />
          {/* <p className="text-xs text-gray-500 mt-1">
            Select users to mention in your post
          </p> */}

        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[40%] px-10 py-1 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
          Post
        </motion.button>
          </div>
      </form>
    </motion.div>
  );
};

export default AddPostForm;