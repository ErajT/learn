import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import axios from "axios";
import { Snackbar, Alert, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Anaheim, Arial, sans-serif",
  },
});

const Container = styled.div`
  padding: 30px;
  margin: 0 auto;
  width: 90%;
  max-width: 800px;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Heading = styled.h1`
  text-align: center;
  color: #2b6777;
  margin-bottom: 20px;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: linear-gradient(to bottom, #ffffff, #e1eef6);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #2b6777;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;
  height: 100px;
  width: 100%;

  &:focus {
    outline: none;
    border: 1px solid #2b6777;
    box-shadow: 0 0 4px rgba(43, 103, 119, 0.4);
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #2b6777;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #1e4c5b;
  }
`;

const Footer = styled.footer`
  color: #2b6777;
  padding: 20px 0;
  text-align: center;
  position: relative;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const LogoContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Logo = styled.img`
  height: 40px;
  margin: 5px;

  @media (max-width: 480px) {
    height: 30px;
  }
`;

const Quotations = () => {
  const [quotation, setQuotation] = useState("");
  const [trainingID, setTrainingID] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const selectedTrainingCookie = Cookies.get("selectedTraining");
    if (selectedTrainingCookie) {
      const selectedTraining = JSON.parse(selectedTrainingCookie);
      setTrainingID(selectedTraining.trainingID);
    }
  }, []);

  const handleSendQuotation = async (e) => {
    e.preventDefault();
    if (quotation.trim() === "") {
      setSnackbarMessage("Quotation cannot be empty!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!trainingID) {
      setSnackbarMessage("TrainingID not found. Please select a training.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:2000/leaderboard/subscribe", {
        TrainingID: trainingID,
        message: quotation,
      });

      setSnackbarMessage("Quotation sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to send quotation. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setQuotation("");
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Heading>Send Quotation</Heading>
        <Form onSubmit={handleSendQuotation}>
          <Label htmlFor="quotation">Enter Quotation:</Label>
          <TextArea
            id="quotation"
            value={quotation}
            onChange={(e) => setQuotation(e.target.value)}
            placeholder="Type your quotation here..."
          />
          <Button type="submit">Send to Participants</Button>
        </Form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default Quotations;
