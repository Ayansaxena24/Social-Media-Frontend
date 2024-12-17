import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./Signup";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";
import { TextEncoder, TextDecoder } from "util";
import { UserProvider } from "../context/UserContext";
import { GET_USERS } from "../graphql/mutations";
import { MockedProvider } from "@apollo/client/testing";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Existing mocks for Firebase and other dependencies...

const mocks = [
  {
    request: {
      query: GET_USERS,
    },
    result: {
      data: {
        users: [{ id: 1, email: 'test@example.com', username: 'testuser', profilePicture: '', bio: '' }],
      },
    },
  },
];

describe("Signup Component", () => {
  // Updated test to include UserProvider
  test("should allow the user to type in email and password fields", async() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserProvider>
          <MemoryRouter>
            <Signup />
          </MemoryRouter>
        </UserProvider>
      </MockedProvider>
    );

    // Use userEvent to simulate typing
    const emailInput = screen.getByTestId("email123");
    const bio = screen.getAllByTestId("bio");
    const passwordInput = screen.getAllByTestId(/password/i);
    const imageButton = screen.getAllByTestId('imageButton');
    const submitButton = screen.getAllByTestId('submitButton');
    const displayName = screen.getAllByTestId('displayName');
  
    await userEvent.type(emailInput, "qw@gmail.com");
    await userEvent.type(bio[0], "Code testing");
    await userEvent.type(passwordInput[0], "1234");
    await userEvent.type(displayName[0], "Tester");
    userEvent.click(imageButton[0]);
    expect(imageButton).toHaveLength(1);
    await userEvent.type(passwordInput[0], "1234");
    userEvent.click(submitButton[0]);
    expect(submitButton).toHaveLength(1);
  
    // Assertions
    expect(emailInput).toBeInTheDocument();
    expect(bio[0]).toBeInTheDocument();
    expect(passwordInput[0]).toBeInTheDocument();
    expect(displayName[0]).toBeInTheDocument();
  });
});