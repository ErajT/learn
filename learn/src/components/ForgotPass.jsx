import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { backendUrl } from "./constants";

// Styled Components
const MainContainer = styled.div`
  background: linear-gradient(to bottom, #e0f7f3, #f0f8f7);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
`;

const Container = styled.div`
  background-color: #f0f8f7;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: absolute;
  top: 20%;
  left: 30%;
  overflow: hidden;
  width: 40vw;
  max-width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;

  @media (max-width: 1000px) {
    width: 90vw;
    left: 5%;
    right: 5%;
  }
`;

const FormContainer = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: bold;
  color: #2b6777;
`;

const InputContainer = styled.div`
  width: 100%;
  margin: 8px 0;
`;

const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #2b6777;
  background-color: #2b6777;
  color: #f0f8f7;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
`;

const Snackbar = styled.div`
  visibility: ${(props) => (props.open ? "visible" : "hidden")};
  min-width: 250px;
  margin-left: -125px;
  background-color: ${(props) =>
    props.severity === "success" ? "#2b6777" : "#f44336"};
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
`;

const ForgotPass = () => {
  // const backendUrl = "http://localhost:2000";  // Use this in API calls

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(email)) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/users/forgetpassword`, {
        email: email,
      });
      // console.log("api hit");

      if (response.status === 200) {
        setSnackbarMessage("Password reset link sent to your email!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        throw new Error("Failed to send reset link.");
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Error sending password reset link.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <Container>
        <FormContainer>
          <Title>Forgot Password</Title>
          <InputContainer>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputContainer>
          <Button disabled={loading} onClick={handleForgotPassword}>
            Send Reset Link
          </Button>
        </FormContainer>
      </Container>
      <Snackbar open={snackbarOpen} severity={snackbarSeverity}>
        {snackbarMessage}
      </Snackbar>
    </MainContainer>
  );
};

export default ForgotPass;
