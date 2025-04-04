import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Snackbar, Alert } from "@mui/material";
import Cookies from "js-cookie";
import { backendUrl } from "./constants";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Anaheim, Arial, sans-serif",
  },
});

// Inject @font-face rule
const GlobalStyles = styled("style")(() => ({
  "@font-face": {
    fontFamily: "Anaheim",
    src: "url('/Anaheim.ttf') format('truetype')",
  },
}));

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
  // background-color: #fff;
  min-height: 100vh;
  // min-width: 100vw;
  padding: 20px;
  color: #333;

  @media (max-width: 768px) {
    // padding: 10px;
  }
`;

const Title = styled.h1`
  margin: 20px 0;
  font-size: 3rem;
  color: #2b6777;
  fontFamily: "Anaheim, Arial, sans-serif",

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
    // margin
  }
`;
const ImageContainer = styled.div`
  position: absolute;
  top: ${({ smallScreen }) => (smallScreen ? "40px" : "35%")};
  left: ${({ smallScreen }) => (smallScreen ? "5px" : "auto")};
  right: ${({ smallScreen }) => (smallScreen ? "auto" : "180px")};
  transform: ${({ smallScreen }) => (smallScreen ? "none" : "translateY(-50%)")};
  z-index: 10;

  img {
    max-width: ${({ smallScreen }) => (smallScreen ? "120px" : "200px")};
    max-height: ${({ smallScreen }) => (smallScreen ? "140px" : "200px")};
  }

  @media (max-width: 820px) {
    top: 150px;
    left: 240px;
    right: auto;
    transform: none;

    img {
      max-width: 150px;
      max-height: 180px;
    }
  }
     @media (max-width: 1040px) {
    top: 150px;
    left: 380px;
    right: auto;
    transform: none;

    img {
      max-width: 150px;
      max-height: 180px;
    }
  }
     @media (max-width: 1200px) {
    top: 150px;
    left: 700px;
    right: auto;
    transform: none;

    img {
      max-width: 150px;
      max-height: 180px;
    }
  }

  @media (max-width: 768px) {
    top: 150px;
    left: 240px;
    right: auto;
    transform: none;

    img {
      max-width: 130px;
      max-height: 160px;
    }
  }
    @media (max-width: 700px) {
    top: 200px;
    left: 240px;
    right: auto;
    transform: none;

    img {
      max-width: 130px;
      max-height: 160px;
    }
  }
      @media (max-width: 725px) {
    top: 220px;
    left: 240px;
    right: auto;
    transform: none;

    img {
      max-width: 130px;
      max-height: 160px;
    }
  }

  @media (max-width: 480px) {
    top: 280px;
    left: 240px;
    right: auto;
    transform: none;

    img {
      max-width: 120px;
      max-height: 140px;
    }
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
  const tok = Cookies.get("token");
  const token = JSON.parse(tok);
  // const backendUrl = "http://localhost:2000";  // Use this in API calls

  const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thur", "Fri"];
  // Get today's index
  const currentDayIndex = new Date().getDay(); // Returns 0 for Sunday, 1 for Monday, etc.

  // Map JavaScript's weekday index (0-6) to your `days` array
  const dayMapping = [0, 1, 2, 3, 4, 5, 6]; // Adjust if needed to match your array's order
  const todayidx = dayMapping[(currentDayIndex + 1) % dayMapping.length];
  // console.log(todayidx);

  // Get today's name
  const today = days[todayidx];
  // console.log(today);
  const [currentDay, setCurrentDay] = useState(today);
  // console.log(currentDay);
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
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

useEffect(() => {
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };
    selectedDate.setDate(selectedDate.getDate());
  
    // Format the selected date in DD-MM-YYYY format
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${dd}-${mm}-${yyyy}`;
  
    // Update state with the formatted date
    setSelectedDate(formattedDate);
    console.log(formattedDate);

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const cookieData = Cookies.get("traineeDetails");
  const { TrainingID, TraineeID } = cookieData ? JSON.parse(cookieData) : {};


  const handleDayClick = (index) => {
    // Calculate the difference between today and the selected day index
    const difference = index - todayidx;
  
    // Calculate the selected date based on the difference
    const selectedDateObj = new Date();
    selectedDateObj.setDate(selectedDateObj.getDate() + difference);
  
    // Format the selected date in DD-MM-YYYY format
    const yyyy = selectedDateObj.getFullYear();
    const mm = String(selectedDateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDateObj.getDate()).padStart(2, '0');
    const formattedDate = `${dd}-${mm}-${yyyy}`;
  
    // Update state with the formatted date
    setSelectedDate(formattedDate);
  
    console.log(`Selected Date: ${selectedDate}`);
  };
  
  


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
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
      body: JSON.stringify({ TrainingID, TraineeID, Example: exampleText, newDate: selectedDate }),
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
      headers: { "Content-Type": "application/json",Authorization: `Bearer ${token}` },
      body: JSON.stringify({ TrainingID, TraineeID, refer: referenceEmail, newDate: selectedDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbar({ open: true, message: "Participant referred successfully!", severity: "success" });
      })
      .catch((error) => {
        setSnackbar({ open: true, message: "Error referring Participant.", severity: "error" });
        console.error("Error referring Participant:", error);
      });
  };

  const handlePhotoSubmit = () => {
    if (!photoFile) {
      setSnackbar({ open: true, message: "Please select a photo file to upload.", severity: "error" });
      return;
    }
    // console.log(photoFile);

    const formData = new FormData();
    formData.append("TrainingID", TrainingID);
    formData.append("TraineeID", TraineeID);
    formData.append("photo", photoFile);
    formData.append("newDate", selectedDate);

    fetch(`${backendUrl}/leaderboard/photo`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
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
     <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
    <AppContainer>
      <Title>Weekly Learning Checklist</Title>
      <DaySelector>
        {days.map((day, index) => (
          <DayButton key={day} active={index <= todayidx} disabled={index > todayidx+1}  
          onClick={() => {handleDayClick(index); setSelectedDayIndex(index)}}
          style={{
            border: index === selectedDayIndex ? "3px solid black" : "none",
            transition: "border 0.2s ease",
          }}          
        >
            {day[0]} {/* Displaying only the first letter */}
          </DayButton>
        ))}
      </DaySelector>
      <ImageContainer smallScreen={isSmallScreen}>
        <img src="/form1.png" alt="Checklist Illustration" />
      </ImageContainer>
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
                accept=".jpeg" 
                onChange={(e) => setPhotoFile(e.target.files[0])} 
              />
              <Button onClick={handlePhotoSubmit}>Submit Photo</Button>
            </UploadSection>
            <UploadSection>
              <h3>Reference</h3>
              <Input
                type="email"
                placeholder="Enter Participant email"
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
    </ThemeProvider>
  );
};
export default Application;


