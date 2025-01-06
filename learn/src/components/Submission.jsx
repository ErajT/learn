import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Modal,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";
import styled from "styled-components";
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

const TrainingPage = () => {
  const theme = useTheme();
  const backendUrl = "http://localhost:2000"; // Use this in API calls

  const [trainees, setTrainees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [trainingId, setTrainingId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [pdfEnabled, setPdfEnabled] = useState(false);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const selectedTrainingCookie = Cookies.get("selectedTraining");
    if (selectedTrainingCookie) {
      const selectedTraining = JSON.parse(selectedTrainingCookie);
      if (selectedTraining?.trainingID) {
        setTrainingId(selectedTraining.trainingID);
      } else {
        setError("Invalid training data in cookies.");
      }
    } else {
      setError("No selected training found in cookies.");
    }
  }, []);

  useEffect(() => {
    const fetchTrainees = async () => {
      if (!trainingId) {
        setError("No training ID available.");
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/admin/getAllTraineesForTraining/${trainingId}`
        );

        if (response.data.status === "success") {
          setTrainees(response.data.data);
        } else {
          setError("Failed to fetch trainees.");
        }
      } catch (err) {
        setError("Error fetching trainees.");
      }
    };

    if (trainingId) {
      fetchTrainees();
    }
  }, [trainingId]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setError("");
    setSubmission(null);
    setSelectedTrainee(null);
    setSnackbarMessage("Date selected successfully.");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };
  const fetchSubmission = async (traineeId) => {
    try {
      const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

      const response = await axios.get(
        `${backendUrl}/admin/getSubmissionsBasedOnDate/${trainingId}/${traineeId}/${formattedDate}`
      );

      if (response.data.status === "success") {
        setSubmission(response.data.submission);
        setSnackbarMessage("Submission fetched successfully.");
        setSnackbarSeverity("success");
      } else {
        setSubmission(null);
        setSnackbarMessage("No submission found for this trainee.");
        setSnackbarSeverity("warning");
      }
    } catch (err) {
      setSubmission(null);
      setSnackbarMessage("Error fetching submission.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };
  
  
  const convertBytesToBase64 = (byteArray) => {
    const binary = String.fromCharCode.apply(null, byteArray);
    return window.btoa(binary);
  };

  const generatePdfForTrainee = async (traineeId,Name) => {
    try {
      const response = await axios.get(
        `${backendUrl}/admin/getSubmissionsOfTrainee/${trainingId}/${traineeId}`
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        const doc = new jsPDF();
doc.setFontSize(22);
// doc.text("Trainee Submissions for ", 10, 10);
doc.text(`All Submissions for ${Name || "N/A"}`, 52,19);

let yPosition = 30;

response.data.forEach((submission, index) => {
  const boxHeight = 80; 
  const boxWidth = 180;
  const imageWidth = 70;
  const imageHeight = 60;

  doc.setDrawColor(0);
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition, boxWidth, boxHeight, "FD");
  doc.setFontSize(12);
  // doc.text(`Date: ${Name || "N/A"}`, 15, yPosition + );
  doc.text(`Submission ${index + 1}:`, 15, yPosition + 10);
  doc.text(`Date: ${submission.Date ? submission.Date.substring(0, 10) : "N/A"}`, 15, yPosition + 20);
  const exampleText = `Example: ${submission.Example || "N/A"}`;
  const wrappedExample = doc.splitTextToSize(exampleText, 90); 
  doc.text(wrappedExample, 15, yPosition + 30);
  const exampleHeight = doc.getTextDimensions(wrappedExample).h;
  const referenceYPosition = yPosition + 30 + exampleHeight + 5; 
  const referenceText = `Reference: ${submission.Refer || "N/A"}`;
  const wrappedReference = doc.splitTextToSize(referenceText, 90); 
  doc.text(wrappedReference, 15, referenceYPosition);

  if (submission.Photo && submission.Photo.data) {
    const base64Image = `data:image/jpeg;base64,${convertBytesToBase64(submission.Photo.data)}`;
    doc.addImage(base64Image, "JPEG", 110, yPosition + 15, imageWidth, imageHeight);
  }

  const referenceHeight = doc.getTextDimensions(wrappedReference).h;
  const dynamicBoxHeight = Math.max(boxHeight, exampleHeight + referenceHeight + 50); 

  yPosition += dynamicBoxHeight + 10;

  if (yPosition > doc.internal.pageSize.height - 50) {
    doc.addPage();
    yPosition = 30;
  }
});


        doc.save(`trainee-${traineeId}-submissions.pdf`);
        setSnackbarMessage("PDF generated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("No submissions found for this trainee.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Error while fetching submissions.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSelectTrainee = (traineeId) => {
    setSelectedTrainees((prevSelected) =>
      prevSelected.includes(traineeId)
        ? prevSelected.filter((id) => id !== traineeId)
        : [...prevSelected, traineeId]
    );
  };
  const handleDeselectAll = () => {
    setSelectedTrainees([]); 
    setSelectAllChecked(false); 
  };
  

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedTrainees([]);
    } else {
      setSelectedTrainees(trainees.map((trainee) => trainee.TraineeID));
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const handleApprove = async () => {
    if (!selectedDate) {
      setSnackbarMessage("Please select a date.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (selectedTrainees.length === 0) {
      setSnackbarMessage("Please select at least one trainee.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

    const requestBody = {
      TrainingID: trainingId,
      TraineeIDs: selectedTrainees,
      Date: formattedDate,
    };

    try {
      const response = await axios.post(`${backendUrl}/admin/approve`, requestBody);

      if (response.status === 200 && response.data?.message) {
        setSnackbarMessage("Approved");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Failed to approve trainees.");
        setSnackbarSeverity("error");
      }
    } catch (err) {
      setSnackbarMessage("An error occurred while approving trainees.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <GlobalStyles />
   <LocalizationProvider dateAdapter={AdapterDayjs}>
  <Box
    sx={{
      padding: "20px",
      // backgroundColor: "#f9fcff",
      borderRadius: "12px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
      width: "100%", 
      margin: "0 auto",
    }}
  >
    <Typography
  variant="h2"
  sx={{
    textAlign: "center",
    color: "#2b6777",
    fontWeight: "bold",
    marginBottom: "20px",
    marginTop: "20px",
    fontSize: {
      xs: "1.8rem", 
      sm: "2.3rem",   
      md: "2.8rem", 
      lg: "3rem",   
    },
    // fontFamily: "'anah', sans-serif",
    fontFamily: "Anaheim, Arial, sans-serif",
  }}
>
  Submission Details
</Typography>



    <DateCalendar
  disableFuture
  value={selectedDate}
  onChange={handleDateChange}
  sx={{
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px", 
    margin: "0 auto", 
    [theme.breakpoints.down("sm")]: {
      maxWidth: "300px", 
      fontSize: "0.9rem", 
    },
    [theme.breakpoints.down("xs")]: {
      maxWidth: "250px", 
      fontSize: "0.8rem",
    },
  }}
/>


    {error && (
      <Typography color="error" sx={{ marginBottom: "10px" }}>
        {error}
      </Typography>
    )}
     <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "30px",marginTop:"20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleApprove}
        sx={{
          backgroundColor: "#2b6777",
          "&:hover": {
            backgroundColor: "#1b4d56",
          },
        }}
      >
        Approve
      </Button>
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <Button
  variant="contained"
  color="primary"
  onClick={handleSelectAll}
  sx={{
    backgroundColor: "#2b6777",
    "&:hover": {
      backgroundColor: "#1b4d56",
    },
  }}
>
  {selectAllChecked ? "Unselect All" : "Select All"}
</Button>
        {/* <Button
          variant="outlined"
          color="primary"
          onClick={handleDeselectAll}
          sx={{
            marginLeft: "10px",
            color: "#2b6777",
            "&:hover": {
              backgroundColor: "#f4f7fa",
            },
          }}
        >
          Deselect All
        </Button> */}
      </Box>
    </Box>

    <Grid container spacing={3}>
      {trainees.map((trainee) => (
        <Grid item xs={12} sm={6} md={4} key={trainee.TraineeID}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "16px",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
            data-traineeid={trainee.TraineeID}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTrainees.includes(trainee.TraineeID)}
                    onChange={() => handleSelectTrainee(trainee.TraineeID)}
                    color="primary"
                  />
                }
                label={trainee.Name}
              />
              <IconButton
                onClick={() => {
                  setSelectedTrainee(trainee.TraineeID);
                  fetchSubmission(trainee.TraineeID);
                  setPdfEnabled(true);
                }}
                disabled={!selectedDate}
                sx={{
                  color: "#2b6777",
                  "&:hover": {
                    color: "#1b4d56",
                  },
                }}
              >
                <ArrowDropDownIcon />
              </IconButton>
            </Box>

            {selectedTrainee === trainee.TraineeID && submission && (
              <Box
                sx={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#f4f7fa",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2b6777",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Submission Details
                </Typography>
                <Typography>
                  Example: {submission.Example || "N/A"}
                </Typography>
                <Typography>
                  Reference: {submission.Refer || "N/A"}
                </Typography>
                {submission.Photo && (
                  <img
                    src={`data:image/jpeg;base64,${convertBytesToBase64(
                      submission.Photo.data
                    )}`}
                    alt="Submission"
                    onClick={() =>
                      setModalImage(
                        `data:image/jpeg;base64,${convertBytesToBase64(
                          submission.Photo.data
                        )}`
                      )
                    }
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      marginTop: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  />
                )}
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              disabled={!selectedDate}
              // onClick={() => fetchAllSubmissionsForTrainee(trainee.TraineeID)}
              onClick={() => generatePdfForTrainee(trainee.TraineeID,trainee.Name)}
              sx={{
                marginTop: "16px",
                backgroundColor: "#2b6777",
                "&:hover": {
                  backgroundColor: "#1b4d56",
                },
              }}
            >
              Generate PDF
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>

    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          boxShadow: 24,
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto",
        }}
      >
        <img
          src={modalImage}
          alt="Full Size Submission"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </Box>
    </Modal>
  </Box>
</LocalizationProvider>
</ThemeProvider>
  
  );
};

export default TrainingPage;