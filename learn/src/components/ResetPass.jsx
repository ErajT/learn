import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";  // Import useParams to get token from URL
import { backendUrl } from "./constants";
import { useNavigate } from "react-router-dom";

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
  min-height: 250px;
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

const ResetPass = () => {
  // const backendUrl = "http://localhost:2000";  // Use this in API calls
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      setSnackbarMessage("Password must be at least 6 characters and contain both letters and numbers.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
        // console.log("api not hit yet");
      const response = await axios.patch(
        `${backendUrl}/users/resetPassword/${token}`,  // Send token in URL
        { updatedPassword: password }
      );

      if (response.status === 200) {
        setSnackbarMessage("Password reset successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          Navigate("/login"); // Use location.href for redirection
        }, 2000);
      } else {
        throw new Error("Failed to reset password.");
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || "Error resetting password.");
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
          <Title>Reset Password</Title>
          <InputContainer>
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputContainer>
          <InputContainer>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </InputContainer>
          <Button disabled={loading} onClick={handleResetPassword}>
            Reset Password
          </Button>
        </FormContainer>
      </Container>
      <Snackbar open={snackbarOpen} severity={snackbarSeverity}>
        {snackbarMessage}
      </Snackbar>
    </MainContainer>
  );
};

export default ResetPass;
