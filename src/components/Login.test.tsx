import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { auth } from "../auth/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";
// At the top of Login.test.tsx
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;


// Mock the Firebase Auth function
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  auth: {},
}));

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      currentUser: null,
    })),
    signInWithEmailAndPassword: jest.fn(),
  }));
  
  jest.mock("firebase/app", () => ({
    initializeApp: jest.fn(),
  }));
  
  jest.mock("firebase/analytics", () => ({
    getAnalytics: jest.fn(),
  }));
  

describe("Login Component", () => {
  beforeEach(() => {
    render(
      <Router>
        <Login />
      </Router>
    );
  });

  test("should render login form correctly", () => {
    // Check if the form elements are rendered correctly
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("should allow the user to type in email and password fields", async() => {
    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

    // Use userEvent to simulate typing
    const emailInput = screen.getAllByTestId("email123");
    const passwordInput = screen.getAllByTestId(/password/i);
  
    await userEvent.type(emailInput[0], "qw");
    await userEvent.type(passwordInput[0], "1234");
  
    // Assertions
    expect(emailInput[0]).toHaveValue("qw");
    expect(passwordInput[0]).toHaveValue("1234");
  });

  test("should toggle password visibility when eye button is clicked", () => {
    // Initial state should be password input type
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    // Click the "eye" button to toggle visibility
    userEvent.click(screen.getByTestId(/eye/i));

    // Check if password is now visible
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click again to hide password
    userEvent.click(screen.getByTestId(/eye/i));

    // Check if password is hidden again
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test('Testing the Create a New Account Button', () => {
    const button = screen.getByTestId('createAccountButton');
    userEvent.click(button);
    expect(button).toBeInTheDocument();
    const checkboxButton = screen.getByTestId('checkbox');
    userEvent.click(checkboxButton);
    expect(checkboxButton).toBeChecked;
    const forgotpasswordButton = screen.getByTestId('forgotpassword');
    userEvent.click(forgotpasswordButton);
    expect(forgotpasswordButton).toBeInTheDocument();
  });

});
