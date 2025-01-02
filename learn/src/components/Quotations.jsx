import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";

const Container = styled.div`
  padding: 30px;
  margin: 0 auto;
  max-width: 800px;
`;

const Heading = styled.h1`
  text-align: center;
  color: #2b6777;
  margin-bottom: 20px;
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(to bottom, #ffffff, #e1eef6);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

  &:focus {
    outline: none;
    border: 1px solid #2b6777;
    box-shadow: 0 0 4px rgba(43, 103, 119, 0.4);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #2b6777;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1e4c5b;
  }

  @media (max-width: 768px) {
    width: 100%;
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
      console.log(selectedTraining);
      setTrainingID(selectedTraining.trainingID); // Assuming TrainingID is stored in the cookie
      console.log("Selected Training:", selectedTraining);
    } else {
      console.log("No selected training found in cookies.");
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

      console.log("API Response:", response.data);
      setSnackbarMessage("Quotation sent successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error sending quotation:", error);
      setSnackbarMessage("Failed to send quotation. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    // Clear the input field
    setQuotation("");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
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
  );
};

export default Quotations;
