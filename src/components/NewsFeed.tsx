import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUser } from "../context/UserContext";
import AddPostForm from "./AddPostForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ThumbsUp, UserPlus, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      bio
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
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [numberOfFollowers, setNumberOfFollowers] = useState(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState(0);
  const [profPic, setProfPic] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const POSTS_PER_LOAD = 10; // Number of posts to load initially and per scroll
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();

  // const handleLike = async (postId: string) => {
  //   try {
  //     let dp = userData?.users.filter(
  //       (item: any) => item.email === user?.email
  //     );
  //     // console.log(userData.users, "dp");
  //     await likePost({ variables: { postId, userId: dp[0]?.id } });
  //     refetch(); // Refetch posts to update the like count
  //   } catch (error) {
  //     // console.error("Error liking post:", error);
  //   }
  // };

  const handleLike = async (postId: string) => {
    try {
      let dp = userData?.users.filter(
        (item: any) => item.email === user?.email
      );
      
      // Perform the like mutation
      await likePost({ variables: { postId, userId: dp[0]?.id } });
      
      // Refetch to get the updated post data from the backend
      await refetch();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // useEffect(() => {
  //   setDisplayedPosts(visibleslice(0, POSTS_PER_LOAD * pageNumber) || []);
  // }, [data])

  useEffect(() => {
    console.log(data, "data");
    handleDp();
  }, [data])

  // console.log(data, "data");

  // useEffect(() => {
  //   const presentUserId = userData?.users.find(
  //     (item: any) => item.email === user?.email
  //   )?.id;
  //   // console.log(presentUserId, "presentUserId");
  //   //posts from all the users that the current user is following + posts from current user
  //   const visiblePosts = data?.posts.filter(
  //     (item: any) =>
  //       userData?.users
  //         .find((user: any) => user.id === presentUserId)
  //         ?.following.includes(item.authorid) || item.authorid === presentUserId
  //   );
  //   // console.log(userData?.users, "visiblePosts");
  //   // console.log(visiblePosts, "posts");
  //   setAvailablePosts(visiblePosts);

  //   const visibleUsers = userData?.users.filter(
  //     (item: any) => item.id !== presentUserId
  //   );
  //   setDisplayUsers(visibleUsers);
  //   refetch();
  // }, [userData, data, user]);

  console.log(data, "dataaaa")

  // useEffect(() => {
  //   const presentUserId = userData?.users.find(
  //     (item: any) => item.email === user?.email
  //   )?.id;

  //   // Filter visible posts based on following and current user
  //   const visiblePosts = data?.posts.filter(
  //     (item: any) =>
  //       userData?.users
  //         .find((user: any) => user.id === presentUserId)
  //         ?.following.includes(item.authorid) || item.authorid === presentUserId
  //   );

  //   setAvailablePosts(visiblePosts || []);

  //   // Update displayed posts and hasMore status
  //   const initialPosts = visiblePosts?.slice(0, POSTS_PER_LOAD) || [];
  //   setDisplayedPosts(initialPosts);
  //   setHasMore((visiblePosts?.length || 0) > POSTS_PER_LOAD);
  //   const visibleUsers = userData?.users.filter(
  //         (item: any) => item.id !== presentUserId
  //       );
  //       setDisplayUsers(visibleUsers);
  //       refetch();
  // }, [userData, data, user]);

  useEffect(() => {
    const presentUserId = userData?.users.find(
      (item: any) => item.email === user?.email
    )?.id;
  
    // Filter visible posts based on following and current user
    const visiblePosts = data?.posts.filter(
      (item: any) =>
        userData?.users
          .find((user: any) => user.id === presentUserId)
          ?.following.includes(item.authorid) || item.authorid === presentUserId
    ) || [];
  
    setAvailablePosts(visiblePosts);
    setDisplayedPosts(visiblePosts.slice(0, POSTS_PER_LOAD*pageNumber));
  
    // Only update displayed posts if they are empty
    if (displayedPosts.length === 0) {
      const initialPosts = visiblePosts.slice(0, POSTS_PER_LOAD);
      setDisplayedPosts(initialPosts);
      setHasMore(visiblePosts.length > POSTS_PER_LOAD);
    }
  
    const visibleUsers = userData?.users.filter(
      (item: any) => item.id !== presentUserId
    );
    setDisplayUsers(visibleUsers);
  }, [userData, data, user, displayedPosts.length]);


  const handleFollow = async (followeeId: string) => {
    try {
      const follower = userData?.users.filter(
        (item: any) => item.email === user?.email
      );
      const followerId = follower[0]?.id;
      // console.log(followerId, "followerId");

      if (!followerId) {
        // console.error("Current user not found");
        return;
      }

      await followUser({
        variables: {
          followerId,
          followeeId,
        },
      });

      refetch(); // Refetch users to update the follow status
    } catch (error) {
      // console.error("Error following user:", error);
    }
  };

  const handleDp = () => {
    let dp = userData?.users.filter(
      (item: any) => item.email === user?.email
    );
    if (dp) {
      setProfPic(dp[0]?.profilePicture);
      // console.log(dp, "dp");
    }
    if (dp) {
      setUserName(dp[0]?.username);
      setNumberOfFollowers(dp[0]?.followers.length);
      setNumberOfFollowing(dp[0]?.following.length);
      setNumberOfPosts(
        data?.posts.filter((item: any) => item.authorid === dp[0]?.id).length
      );
      setBio(dp[0]?.bio);
    }
  };

  useEffect(() => {
    handleDp();
    if (userData?.users?.length < 1) navigate('/login')
  }, [userData, user]);

  useEffect(() => {
    refetch();
    if (data) {
      setPosts(data.posts);
      // Initially display first batch of posts
      setDisplayedPosts(data.posts.slice(0, POSTS_PER_LOAD));
      setAvailablePosts(data.posts.slice(0, POSTS_PER_LOAD));
      // Update hasMore status
      setHasMore(data.posts.length > POSTS_PER_LOAD);
    }
  }, [data]);

  // console.log(userData, "userData");

  // const loadMorePosts = () => {
  //   // Calculate the current number of displayed posts
  //   const currentLength = displayedPosts.length;

  //   // Determine the next batch of posts to display
  //   const nextPosts = posts.slice(
  //     currentLength,
  //     currentLength + POSTS_PER_LOAD
  //   );

  //   // Update displayed posts
  //   setDisplayedPosts((prevPosts) => [...prevPosts, ...nextPosts]);
  //   // console.log(displayedPosts, "qwerty");

  //   // Check if there are more posts to load
  //   setHasMore(currentLength + POSTS_PER_LOAD < posts.length);
  // };

  const loadMorePosts = () => {
    // Calculate the current number of displayed posts
    const currentLength = displayedPosts.length;

    // Determine the next batch of posts to display from availablePosts
    const nextPosts = availablePosts.slice(
      currentLength, 
      currentLength + POSTS_PER_LOAD
    );

    // Update displayed posts
    setDisplayedPosts((prevPosts) => [...prevPosts, ...nextPosts]);
    setPageNumber(pageNumber + 1);

    // Check if there are more posts to load
    setHasMore(currentLength + POSTS_PER_LOAD < availablePosts.length);
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
    const presentUserId = userData?.users.find(
      (item: any) => item.email === user.email
    )?.id;
    // console.log(presentUserId, "presentUserId");
    return userData?.users
      .find((item: any) => item.id === presentUserId)
      ?.following.includes(userId);
  };


  // console.log(isFriend("2"), "testtesttest");

  // console.log(displayedPosts, "qwerty");

   const followUserComponent = () => {
    return (
    <div className="flex-1 md:w-[30%]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Who to Follow
            </h2>
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
                      {isFriend(userProfile.id) ?  <UserMinus size={20} />
 : <UserPlus size={20} />}
                    </button>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>
        </div>
    )
   }

  return (
    <div className="px-4 py-8 w-[100%] bg-gray-200"
    style={{ 
      padding: "10px", 
      color: "black",
      backgroundImage: `url('')`,
      backgroundSize: "cover",
      backgroundPosition: "top",
      backgroundRepeat: "no-repeat",
    }}
    >
      {/* <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 text-gray-800"
      >
        News Feed
      </motion.h1> */}

      <div className="flex flex-col md:flex-row gap-8 w-[100%] min-h-screen bg-gray-100 relative">
        {/* Left Section - Profile Box */}
        <div className="lg:w-[20%] md:sticky md:top-4 md:h-[95vh]">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-start items-center h-full sticky top-[50px]"
          >
            <div>
              <div className="flex justify-center items-center">
                {profPic && (
                  <img
                    src={`data:${profPic}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "20%",
                    }}
                  />
                )}
                {!profPic && (
                  <img
                    src={`https://cdn-icons-png.flaticon.com/512/149/149071.png`}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
              <p className="text-center font-bold mt-2 text-[32px]">
                {userName}
              </p>
              <p className="text-center font-mono mt-2 text-md">{bio}</p>
              <div className="flex items-center mt-4 space-x-4 sm:flex-row flex-col">
                <div className="flex flex-col items-center flex-1">
                  <p className="font-semibold text-xl">{numberOfPosts}</p>
                  <p className="text-gray-600">Posts</p>
                </div>
                <div className="h-8 border-r border-gray-300 hidden lg:flex"></div>
                <div className="flex flex-col items-center flex-1 lg:mr-0">
                  <p className="font-semibold text-xl text-center mr-4 lg:mr-0">{numberOfFollowers}</p>
                  <p className="text-gray-600 text-center mr-4 lg:mr-0">Followers</p>
                </div>
                <div className="h-8 border-r border-gray-300 hidden lg:flex"></div>
                <div className="flex flex-col items-center flex-1">
                  <p className="font-semibold text-xl mr-4 lg:mr-0">{numberOfFollowing}</p>
                  <p className="text-gray-600 mr-4 lg:mr-0">Following</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="md:hidden w-full">
        {followUserComponent()}
        </div>

        {/* Center Section - Posts */}
        <div className="flex-1.2 sm:w-[50%]">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white shadow-md rounded-lg p-6 w-[100%]"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AddPostForm />
              </motion.div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 mt-8">
              Posts
            </h2>
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
                {displayedPosts.map(
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
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 last:mb-0"
                    >
                      <div className="flex flex-col gap-y-4">
                        <div className="flex w-[100%] justify-between">
                          <div className="flex gap-x-4">
                            <img
                              src={
                                post.profilePicture
                                  ? post.profilePicture
                                  : `https://cdn-icons-png.flaticon.com/512/149/149071.png`
                              }
                              alt="Profile"
                              className="w-10 h-10 rounded-full"
                            />
                            <p className="text-gray-800 font-bold text-lg">
                              {post.author}
                            </p>
                          </div>
                          {post.mentions.length > 0 && (
                            <div className="flex gap-x-2 items-center">
                              <p className="text-gray-400 text-[12px]">With </p>
                              <p>
                                {post.mentions.map((item) => (
                                  <span className="text-blue-500">
                                    {" "}
                                    {item}{" "}
                                  </span>
                                ))}
                              </p>
                            </div>
                          )}
                        </div>
                          <p className="text-gray-800 ml-2">{post.content}</p>
                        {post.image && <img src={post.image} alt="Post" className="rounded-lg" />}

                        <div className="flex justify-between flex-2">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="like-button text-blue-600 px-3 py-1 rounded"
                          >
                            {post?.likedby.includes(
                              userData?.users.find(
                                (item: any) => item.email === user?.email
                              )?.id
                            )
                              ? (
                                <div className="flex gap-x-2">
                                   <ThumbsUp fill="currentColor" className="w-5 h-5" />                                 
                                  ({post.likes ? post.likes : 0})
                                </div>
                              ) : (
                                <div className="flex gap-x-2">
                                  <ThumbsUp strokeWidth={1} className="w-5 h-5" />                                  
                                  ({post.likes ? post.likes : 0})
                                </div>
                              )}
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
        <div className="hidden md:flex md:w-1/4 w-[100%]">
        {followUserComponent()}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
