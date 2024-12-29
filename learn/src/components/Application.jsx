import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Snackbar, Alert } from "@mui/material";
import Cookies from "js-cookie";

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f9f9f9;
  min-height: 100vh;
  padding: 20px;
  color: #333;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  margin: 20px 0;
  font-size: 2rem;
  color: #2b6777;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const DaySelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 20px;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 100%;

  @media (max-width: 768px) {
    gap: 3px;
  }
`;

const DayButton = styled.button`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: ${({ active }) => (active ? "#2b6777" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#2b6777")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  flex-shrink: 1;
  font-size: 1rem;
  width: 100px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px;
  }
`;

const ChecklistContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  align-item:center;
  text-align:center;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }
`;

const ChecklistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

const Label = styled.span`
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: none;
`;

const Button = styled.button`
  background: #2b6777;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1rem;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const UploadSection = styled.div`
  flex: 1;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 6px;
  }
`;

const Application = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls

  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const today = new Date().toLocaleString("en-US", { weekday: "short" });
  const [currentDay, setCurrentDay] = useState(today);
  const [tasks, setTasks] = useState({
    [today]: [
      { text: "Applied", done: false, type: "checkbox" }
    ],
  });

  const [exampleText, setExampleText] = useState("");
  const [isPhotoEnabled, setPhotoEnabled] = useState(false);
  const [isReferenceEnabled, setReferenceEnabled] = useState(false);
  const [referenceEmail, setReferenceEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const cookieData = Cookies.get("traineeDetails");
  const { TrainingID, TraineeID } = cookieData ? JSON.parse(cookieData) : {};

  const handleCheckboxChange = (taskIndex) => {
    if (taskIndex === 0) {
      setTasks((prev) => {
        const updatedTasks = prev[today].map((task, index) =>
          index === taskIndex ? { ...task, done: !task.done } : task
        );
        return { ...prev, [today]: updatedTasks };
      });
    }
  };

  const handleSubmitExample = () => {
    const wordCount = exampleText.trim().split(/\s+/).length;
    if (wordCount < 1) {
      setSnackbar({ open: true, message: "The example must be at least 150 words.", severity: "error" });
      return;
    }

    fetch(`${backendUrl}/leaderboard/example`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TrainingID, TraineeID, Example: exampleText }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbar({ open: true, message: "Example submitted successfully!", severity: "success" });
        setPhotoEnabled(true);
        setReferenceEnabled(true);
      })
      .catch((error) => {
        setSnackbar({ open: true, message: "Error submitting example.", severity: "error" });
        console.error("Error submitting example:", error);
      });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleReferenceSubmit = () => {
    if (!referenceEmail || !validateEmail(referenceEmail)) {
      setSnackbar({ open: true, message: "Please enter a valid email address.", severity: "error" });
      return;
    }

    fetch(`${backendUrl}/leaderboard/refer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ TrainingID, TraineeID, refer: referenceEmail }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbar({ open: true, message: "Trainee referred successfully!", severity: "success" });
      })
      .catch((error) => {
        setSnackbar({ open: true, message: "Error referring trainee.", severity: "error" });
        console.error("Error referring trainee:", error);
      });
  };

  const handlePhotoSubmit = () => {
    if (!photoFile) {
      setSnackbar({ open: true, message: "Please select a photo file to upload.", severity: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("TrainingID", TrainingID);
    formData.append("TraineeID", TraineeID);
    formData.append("photo", photoFile);

    fetch(`${backendUrl}/leaderboard/photo`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbar({ open: true, message: "Photo submitted successfully!", severity: "success" });
      })
      .catch((error) => {
        setSnackbar({ open: true, message: "Error submitting photo.", severity: "error" });
        console.error("Error submitting photo:", error);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <AppContainer>
      <Title>Weekly Checklist</Title>
      <DaySelector>
        {days.map((day) => (
          <DayButton key={day} active={day === today} disabled={day !== today}>
            {day[0]} {/* Displaying only the first letter */}
          </DayButton>
        ))}
      </DaySelector>
      <ChecklistContainer>
        {tasks[today].map((task, index) => (
          <ChecklistItem key={index}>
            <Label>
              <Checkbox
                type="checkbox"
                checked={task.done}
                disabled={index !== 0 || task.done}
                onChange={() => handleCheckboxChange(index)}
              />
              {task.text}
            </Label>
          </ChecklistItem>
        ))}
        <TextArea
          placeholder="Write your example here (minimum 150 words)"
          value={exampleText}
          disabled={!tasks[today][0].done}
          onChange={(e) => setExampleText(e.target.value)}
        />
        <Button onClick={handleSubmitExample} disabled={!tasks[today][0].done}>
          Submit Example
        </Button>
        {isPhotoEnabled && isReferenceEnabled && (
          <UploadContainer>
            <UploadSection>
              <h3>Photo</h3>
              <input 
                  type="file" 
                  accept=".jpg,.jpeg" 
                  onChange={(e) => setPhotoFile(e.target.files[0])} 
                />
              <Button onClick={handlePhotoSubmit}>Submit Photo</Button>
            </UploadSection>
            <UploadSection>
              <h3>Reference</h3>
              <Input
                type="email"
                placeholder="Enter trainee email"
                value={referenceEmail}
                onChange={(e) => setReferenceEmail(e.target.value)}
              />
              <Button onClick={handleReferenceSubmit}>Submit Reference</Button>
            </UploadSection>
          </UploadContainer>
        )}
      </ChecklistContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppContainer>
  );
};

export default Application;