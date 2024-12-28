import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import axios from "axios";

const TrainingPage = () => {
  const [trainees, setTrainees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState("");
  const [trainingId, setTrainingId] = useState(null);

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
  
      console.log("Fetching trainees for training ID:", trainingId); // Log the trainingId to verify
      try {
        const response = await axios.get(
          `http://localhost:2000/admin/getAllTraineesForTraining/${trainingId}`
        );
        if (response.data.status === "success") {
          setTrainees(response.data.data);
        } else {
          setError("Failed to fetch trainees.");
        }
      } catch (err) {
        console.error(err);
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
        `http://localhost:2000/admin/getSubmissionsBasedOnDate/${trainingId}/${traineeId}/${formattedDate}`
      );

      if (response.data.status === "success") {
        setSubmission(response.data.submission);
      } else {
        setError("No submission found for the selected date.");
        setSubmission(null);
      }
    } catch (err) {
      setError("Error fetching submission.");
      setSubmission(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" mb={3}>
          Training Details
        </Typography>
        <DateCalendar
          disableFuture
          value={selectedDate}
          onChange={handleDateChange}
        />
        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={2} mt={3}>
          {trainees.map((trainee) => (
            <Grid item xs={12} sm={6} md={4} key={trainee.TraineeID}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>{trainee.Name}</Typography>
                <IconButton
                  onClick={() => {
                    setSelectedTrainee(trainee.TraineeID);
                    fetchSubmission(trainee.TraineeID);
                  }}
                  disabled={!selectedDate}
                >
                  <ArrowDropDownIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>

        {submission && (
          <Box mt={4}>
            <Typography variant="h6">Submission Details</Typography>
            <Typography>Example: {submission.Example}</Typography>
            <Typography>Refer: {submission.Refer}</Typography>
            {submission.Photo && (
              <img
                src={`data:image/jpeg;base64,${Buffer.from(
                  submission.Photo.data
                ).toString("base64")}`}
                alt="Submission"
                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
              />
            )}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default TrainingPage;
