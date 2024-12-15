import { gql } from "@apollo/client";

// Mutation to follow a user
export const FOLLOW_USER = gql`
  mutation FollowUser($followerId: String!, $followeeId: String!) {
    followUser(followerId: $followerId, followeeId: $followeeId) {
      id
      name
      followingCount
      followersCount
    }
  }
`;

// Mutation to unfollow a user
export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerId: String!, $followeeId: String!) {
    unfollowUser(followerId: $followerId, followeeId: $followeeId) {
      id
      name
      followingCount
      followersCount
    }
  }
`;

export const SIGN_UP_USER = gql`
  mutation SignUpUser($name: String!, $email: String!, $password: String!) {
    signUpUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      followersCount
      followingCount
      following {
        id
        name
      }
    }
  }
`;