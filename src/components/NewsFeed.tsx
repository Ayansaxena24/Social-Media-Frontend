import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUser } from "../context/UserContext";
import AddPostForm from "./AddPostForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// GraphQL Queries
const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      authorid
      content
      author
      mentions
      image
      profilePicture
      likes
      likedby
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: ID!, $userId: ID!) {
    likePost(postId: $postId, userId: $userId) {
      id
      likes
      likedby
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
      following
      followers
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($followerId: ID!, $followeeId: ID!) {
    followUser(followerId: $followerId, followeeId: $followeeId) {
      id
      following
    }
  }
`;

const NewsFeed: React.FC = () => {
  const { user } = useUser();
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const [likePost] = useMutation(LIKE_POST);
  const [followUser] = useMutation(FOLLOW_USER);
  const [posts, setPosts] = useState([]);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USERS);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [availablePosts, setAvailablePosts] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const POSTS_PER_LOAD = 10; // Number of posts to load initially and per scroll

  const handleLike = async (postId: string) => {
    try {
      let dp = userData?.users.filter((item: any) => item.email === user?.email);
      console.log(userData.users, "dp");
      await likePost({ variables: { postId, userId : dp[0]?.id } });
      refetch(); // Refetch posts to update the like count
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  console.log(data, "data");
  
  useEffect(() => {
    const presentUserId = userData?.users.find((item : any) => item.email === user?.email)?.id;
    console.log(presentUserId, "presentUserId");
    const visiblePosts = data?.posts.filter((item: any) => userData?.users.find((user: any) => item.authorid === presentUserId || user.id === presentUserId)?.following.includes(item.authorid));
    console.log(userData?.users, "visiblePosts");
    setAvailablePosts(visiblePosts);

    const visibleUsers = userData?.users.filter((item: any) => item.id !== presentUserId);
    setDisplayUsers(visibleUsers);
    refetch();
  }, [userData, data, user]);

  const handleFollow = async (followeeId: string) => {
    try {
      const follower = userData?.users.filter((item: any) => item.email === user?.email);
      const followerId = follower[0]?.id;
      console.log(followerId, "followerId");
      
      if (!followerId) {
        console.error("Current user not found");
        return;
      }
  
      await followUser({ 
        variables: { 
          followerId, 
          followeeId 
        } 
      });
      
      refetch(); // Refetch users to update the follow status
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  useEffect(() => {
    refetch();
    if (data) {
      setPosts(data.posts);
      // Initially display first batch of posts
      setDisplayedPosts(data.posts.slice(0, POSTS_PER_LOAD));
      // Update hasMore status
      setHasMore(data.posts.length > POSTS_PER_LOAD);
    }
  }, [data]);

  console.log(userData, "userData");

  const loadMorePosts = () => {
    // Calculate the current number of displayed posts
    const currentLength = displayedPosts.length;

    // Determine the next batch of posts to display
    const nextPosts = posts.slice(
      currentLength,
      currentLength + POSTS_PER_LOAD
    );

    // Update displayed posts
    setDisplayedPosts((prevPosts) => [...prevPosts, ...nextPosts]);
    console.log(displayedPosts, "qwerty");

    // Check if there are more posts to load
    setHasMore(currentLength + POSTS_PER_LOAD < posts.length);
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen text-2xl text-gray-600"
      >
        Please log in first.
      </motion.div>
    );
  }

  if (loading) return <Skeleton count={50} />;

  if (error)
    return (
      <motion.p
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-center text-xl p-4"
      >
        Error: {error.message}
      </motion.p>
    );

  const isFriend = (userId: string) => {
    const presentUserId = userData?.users.find((item : any) => item.email === user.email)?.id;
    console.log(presentUserId, "presentUserId");
    return userData?.users.find((item : any) => item.id === presentUserId)?.following.includes(userId);
  };

  console.log(isFriend("2"), "testtesttest")

  console.log(displayedPosts, "qwerty");

  return (
    <div className="px-4 py-8 w-[100%]">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 text-gray-800"
      >
        News Feed
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section - AddPostForm */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AddPostForm />
          </motion.div>
        </div>

        {/* Center Section - Posts */}
        <div className="flex-1.2 w-[100%] ">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-md rounded-lg p-6 w-[100%]"
          >
            <div className="flex w-[100%] bg-red-300">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AddPostForm />
          </motion.div>
        </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Posts</h2>
            <InfiniteScroll
              dataLength={displayedPosts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              loader={
                <h4 className="text-center my-4">Loading more posts...</h4>
              }
              endMessage={
                <p className="text-center my-4">
                  <b>Yay! You have seen all the posts</b>
                </p>
              }
            >
              <AnimatePresence>
                {availablePosts.map(
                  (post: {
                    id: string;
                    content: string;
                    author: string;
                    mentions: string[];
                    image: string;
                    profilePicture: string;
                    likes: number;
                    likedby: string[];
                  }) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="bg-gray-100 rounded-lg p-4 mb-4 last:mb-0"
                    >
                      <div className="flex flex-col gap-y-4">
                        <div className="flex w-[100%] justify-between">
                          <div className="flex gap-x-4">
                            <img
                              src={post.profilePicture ? post.profilePicture : `https://cdn-icons-png.flaticon.com/512/149/149071.png`}
                              alt="Profile"
                              className="w-8 h-8 rounded-full"
                            />
                            <p className="text-gray-500 italic">
                              - {post.author}
                            </p>
                          </div>
                          {post.mentions && (
                          <div className="flex gap-x-2 items-center">
                            <p className="text-gray-400 text-[12px]">With </p>
                            <p>
                              {post.mentions.map((item) => (
                                <span className="text-blue-500"> {item} </span>
                              ))}
                            </p>
                          </div>
                          )}
                        </div>
                        {post.image && <img src={post.image} alt="Post" />}

                        <div className="flex justify-between flex-2">
                          <p className="text-gray-800 mb-2">{post.content}</p>
                          <button
                            onClick={() => handleLike(post.id)}
                            className="like-button bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            {post?.likedby.includes(userData?.users.find((item : any) => item.email === user?.email)?.id) ? `👎 Dislike (${post.likes ? post.likes : 0})`:`👍 Like (${post.likes ? post.likes : 0})`}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </InfiniteScroll>
          </motion.div>
        </div>

        {/* Right Section - Users List */}
        <div className="flex-1 min-w-[200px]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Who to Follow</h2>
            <AnimatePresence>
              {displayUsers.map(
                (userProfile: {
                  id: string;
                  username: string;
                  email: string;
                }) => (
                  <motion.div
                    key={userProfile.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <p className="text-gray-800">
                      {userProfile.username || <Skeleton />}
                    </p>
                    <button
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        isFriend(userProfile.id)
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      onClick={() => handleFollow(userProfile.id)}
                    >
                      {isFriend(userProfile.id) ? "Unfollow" : "Follow"}
                    </button>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
