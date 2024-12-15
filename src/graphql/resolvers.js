const posts = [];
const users = [];

const resolvers = {
  Mutation: {
    followUser: (_, { followerId, followeeId }) => {
      // Logic to follow a user (e.g., add to a "following" list)
      const follower = users.find(user => user.id === followerId);
      const followee = users.find(user => user.id === followeeId);
      if (follower && followee) {
        follower.following.push(followeeId);
        return true;
      }
      return false;
    },
    unfollowUser: (_, { followerId, followeeId }) => {
      // Logic to unfollow a user
      const follower = users.find(user => user.id === followerId);
      if (follower) {
        follower.following = follower.following.filter(id => id !== followeeId);
        return true;
      }
      return false;
    },
    addPost: (_, { content, author, mentions }) => {
      const newPost = { id: String(posts.length + 1), content, author, mentions };
      posts.push(newPost);
      return newPost;
    }
  }
};

export default resolvers;
