# RaftLabs - Social Media App

This is a social media app built using **React**, **TypeScript**, **GraphQL**, and **Tailwind CSS**. The app allows users to sign up, log in, follow/unfollow others, post content, and view a personalized news feed.

---

## Features

### 1. **User Login AND Signup**
- Users can **sign up** and **log in** securely.
- Authentication is handled using **Firebase Auth**.

![Signup raw](https://github.com/user-attachments/assets/042c6fb2-a51c-478d-b0fe-23e37e32e023)

  ![Login Component](https://github.com/user-attachments/assets/12697ba6-7baa-4835-85b3-e10264e6b843)


### 2. **News Feed**
- Displays posts from people the user follows.
- Fetches posts from a **GraphQL API** for efficient data management.
- Smooth, infinite scroll for viewing more posts without refreshing or clicking "next."
  
![NewsFeed Add post](https://github.com/user-attachments/assets/45d5eae2-ded5-433b-b7ed-d7d4e6d00960)

### 3. **Posting**
- Users can create new posts.
- Posts can include **images** and **tags** (mentioning other users).
- Users can like / unline the available posts.
  
![Post image](https://github.com/user-attachments/assets/90126eaa-ec93-4596-9f38-012ffa82f054)

![like](https://github.com/user-attachments/assets/e75cb224-ac03-41ce-8df1-e8955a6826d9)

### 4. **Follow and Unfollow**
- Users can follow and unfollow other users to personalize their feed.
- Only those posts will be visible to a user, which are from the users whom the current user has followed.

  ![followed posts only](https://github.com/user-attachments/assets/31ba3ccf-2957-48f8-97eb-b02080b2eaea)

![Real time update follow](https://github.com/user-attachments/assets/c368a1ba-8633-47fc-be30-08e83e0204f7)

### 5. **Real-Time Data Updates**
- Powered by GraphQL, the application updates data in real time to ensure users see the most recent changes instantly.  
- Supports infinite scrolling/rendering, enabling users to load new posts and content dynamically as they scroll, enhancing performance and usability.

  ![Infinite rendering](https://github.com/user-attachments/assets/603d5015-e707-4bde-9d3d-7a2f3a5b3300)


### 6. **TypeScript for Safety**
- **TypeScript** is used to ensure type safety across the application, reducing runtime errors and improving code quality.

### 7. **UI with React & Tailwind CSS**
- **React** is used for the front-end, and **Tailwind CSS** is employed for responsive, modern UI styling.
  
![Real time update follow](https://github.com/user-attachments/assets/d8535978-e102-4b32-a962-99b0f428345b)

### 8. **Responsive Design**
- The platform is fully responsive, providing a seamless user experience across all devices, including desktops, tablets, and mobile phones.

  ![Responsive NewsFeed](https://github.com/user-attachments/assets/d9c2fc54-6aa4-4b80-8e12-353ccdba6c87)
  
![Responsive NewsFeed2](https://github.com/user-attachments/assets/e8177c3b-7203-4a64-8b2a-3baf83869bce)


### 9. **Testing**
- Unit and integration tests ensure that critical components and functionalities work as expected.
  
![Tests](https://github.com/user-attachments/assets/489fbc88-f730-46df-af01-72097074d641)

### 10. **Error Handling**
- Comprehensive error handling ensures users are provided with clear feedback when something goes wrong, enhancing the overall user experience.
- Includes error messages for form validation, network issues, and unexpected failures.

![Post Toast Error](https://github.com/user-attachments/assets/2e99cd00-25bf-43c5-9176-064dca206a93)
  
![Signup Bio error](https://github.com/user-attachments/assets/bf99fee8-73dd-4840-9b44-330b8dcc7750)

 ![Alert singin](https://github.com/user-attachments/assets/773385bc-518f-43d6-b013-b34e667bca46)

![Post Toast Error](https://github.com/user-attachments/assets/8ccf66ae-d8b5-4aae-82f4-059451125b7b)


---

## Technologies Used

### Frontend:
- **React**: JavaScript library for building the user interface.
- **TypeScript**: Provides static type checking for improved developer productivity and fewer bugs.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI design.
- **GraphQL**: A query language for fetching data, used to get posts and user information efficiently.
- **Apollo Client**: Used for managing data fetching from the GraphQL server.
- **React Toastify**: Provides customizable toast notifications for better user feedback on actions and errors.  
- **MUI (Material-UI)**: A popular React component library for implementing modern, accessible, and responsive UI components.

### Testing:
- **Jest**: A JavaScript testing framework for unit and integration testing.  
- **React Testing Library (RTL)**: A lightweight testing library to test React components with a focus on user interactions.

### Backend:
- **Apollo Services**: Apollo Client seamlessly stores and manages data through its state management and caching capabilities, eliminating the need for a traditional backend.

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
    cd Social-Media-Frontend
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

