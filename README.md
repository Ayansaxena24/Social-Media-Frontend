# RaftLabs - Social Media App

This is a social media app built using **React**, **TypeScript**, **GraphQL**, and **Tailwind CSS**. The app allows users to sign up, log in, follow/unfollow others, post content, and view a personalized news feed.

---

## Features

### 1. **User Login**
- Users can **sign up** and **log in** securely.
- Authentication is handled using **Firebase Auth**.

### 2. **News Feed**
- Displays posts from people the user follows.
- Fetches posts from a **GraphQL API** for efficient data management.
- Smooth, infinite scroll for viewing more posts without refreshing or clicking "next."

### 3. **Posting**
- Users can create new posts.
- Posts can include **images** and **tags** (mentioning other users).

### 4. **Follow and Unfollow**
- Users can follow and unfollow other users to personalize their feed.

### 5. **TypeScript for Safety**
- **TypeScript** is used to ensure type safety across the application, reducing runtime errors and improving code quality.

### 6. **UI with React & Tailwind CSS**
- **React** is used for the front-end, and **Tailwind CSS** is employed for responsive, modern UI styling.

### 7. **Testing**
- Unit and integration tests ensure that critical components and functionalities work as expected.

---

## Technologies Used

### Frontend:
- **React**: JavaScript library for building the user interface.
- **TypeScript**: Provides static type checking for improved developer productivity and fewer bugs.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI design.
- **GraphQL**: A query language for fetching data, used to get posts and user information efficiently.
- **Apollo Client**: Used for managing data fetching from the GraphQL server.

---

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js or can be installed separately.
- **Git**: [Download and install Git](https://git-scm.com/)

---

### Installation

1. **Clone the Repository**  
   Clone the project to your local machine using the following command:
   
   ```bash
   git clone https://github.com/Ayansaxena24/Social-Media-Frontend.git
   ```

2. **Navigate to the Project Directory**
   Move into the project's root directory:

   ```bash
    cd raftlabs-social-media-app
   ```

3. **Install Dependencies**
   Install all required packages using npm or yarn:

  ```bash
   npm install
  ```
  
  Or if you use yarn:
  ```bash
  yarn install
  ```

### Running The Application
1. **Run the Development Server**
  To start the React application in development mode:

  ```bash
  npm run dev
  ```

  Or for yarn:

  ```bash
  yarn start
  ```
  Open your browser and navigate to http://localhost:3000 (or http://localhost:5173 in some cases) to view the app.

