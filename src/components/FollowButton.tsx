import { useState } from "react";
import { useMutation } from "@apollo/client";
import { FOLLOW_USER, UNFOLLOW_USER } from "../graphql/mutations"; // Replace with actual mutation imports

// Define the FollowButton component
const FollowButton: React.FC<{ userId: string, followeeId: string }> = ({ userId, followeeId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Using Apollo's useMutation hook to call follow/unfollow mutations
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Call GraphQL unfollow mutation
        await unfollowUser({ variables: { followerId: userId, followeeId } });
      } else {
        // Call GraphQL follow mutation
        await followUser({ variables: { followerId: userId, followeeId } });
      }
      // Toggle follow status
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  return (
    <button onClick={handleFollow}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
