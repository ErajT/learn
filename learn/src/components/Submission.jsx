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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import axios from "axios";
import jsPDF from "jspdf";

const TrainingPage = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls

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

  const fetchAllSubmissionsForTrainee = async () => {
    if (!selectedTrainee) {
      setSnackbarMessage("No trainee selected.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  
    try {
      console.log(`Fetching submissions for trainee ID: ${selectedTrainee}`);
      const response = await axios.get(
        `${backendUrl}/admin/getSubmissionsOfTrainee/${trainingId}/${selectedTrainee}`
      );
  
      console.log("Response from API:", response.data);
  
      // Check if the response data is an array
      if (Array.isArray(response.data) && response.data.length > 0) {
        const traineeSubmissions = response.data;
        console.log("Trainee submissions:", traineeSubmissions);
  
        traineeSubmissions.forEach((submission) => {
          console.log("Processing submission:", submission);
          handleGeneratePDF(submission);
        });
      } else {
        console.log("No submissions found or unexpected response.");
        setSnackbarMessage("No submissions found for this trainee.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error while fetching submissions:", err);
  
      if (err.response) {
        console.error("Server responded with an error:", err.response.data);
        setSnackbarMessage(err.response.data?.message || "Server error occurred.");
      } else if (err.request) {
        console.error("No response received from server:", err.request);
        setSnackbarMessage("Network error. Unable to fetch data. Please check your connection.");
      } else {
        console.error("Error setting up request:", err.message);
        setSnackbarMessage("An unexpected error occurred. Please try again.");
      }
  
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  
  

  const convertBytesToBase64 = (byteArray) => {
    const binary = String.fromCharCode.apply(null, byteArray);
    return window.btoa(binary);
  };

  const handleGeneratePDF = async (submission) => {
    try {
      if (submission) {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Submission Details", 10, 10);
        doc.setFontSize(12);
        // doc.text(`Date: ${trainee.Name || "N/A"}`, 4, 20);
        doc.text(`Date: ${submission.Date || "N/A"}`, 10, 20);
        doc.text(`Example: ${submission.Example || "N/A"}`, 10, 30);
        doc.text(`Reference: ${submission.Refer || "N/A"}`, 10, 40);

        if (submission.Photo) {
          const base64Image = `data:image/jpeg;base64,${convertBytesToBase64(
            submission.Photo.data
          )}`;
          doc.addImage(base64Image, "JPEG", 10, 50, 50, 50);
        }

        doc.save("submission-details.pdf");
        setSnackbarMessage("PDF generated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("No submission data available to generate PDF.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Failed to generate PDF.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#f9fcff",
          borderRadius: "12px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Centered Heading */}
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#2b6777",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Training Details
        </Typography>

        {/* Calendar */}
        <DateCalendar
          disableFuture
          value={selectedDate}
          onChange={handleDateChange}
          sx={{
            marginBottom: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />

        {error && (
          <Typography color="error" sx={{ marginBottom: "10px" }}>
            {error}
          </Typography>
        )}

        {/* Trainee List */}
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
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      flexGrow: 1,
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {trainee.Name}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setSelectedTrainee(trainee.TraineeID);
                      fetchSubmission(trainee.TraineeID);
                      setPdfEnabled(true); // Enable PDF button after drop arrow click
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

                {/* Submission Details */}
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
                          handleImageClick(
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
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Generate PDF Button */}
        <Button
          variant="contained"
          color="primary"
          disabled={!pdfEnabled}
          onClick={fetchAllSubmissionsForTrainee}
          sx={{ marginTop: "20px", marginLeft: "auto", display: "block" }}
        >
          Generate PDF
        </Button>
      </Box>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "success"
                ? "#d4edda"
                : snackbarSeverity === "warning"
                ? "#fff3cd"
                : "#f8d7da",
            color:
              snackbarSeverity === "success"
                ? "#155724"
                : snackbarSeverity === "warning"
                ? "#856404"
                : "#721c24",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal for image display */}
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
    </LocalizationProvider>
  );
};

export default TrainingPage;
