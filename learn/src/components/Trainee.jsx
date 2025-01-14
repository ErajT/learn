import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
const TraineePage = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls

  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [newTrainee, setNewTrainee] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(() =>
    trainees.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
);
  const [trainingId, setTrainingId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [traineeIds, setTraineeIds] = useState(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  useEffect(() => {
    setPasswordVisible(
        trainees.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
    );
}, [trainees]);

  // Fetch trainees when component mounts or trainingId changes
  useEffect(() => {
    const selectedTraining = Cookies.get("selectedTraining");
    if (selectedTraining) {
      const parsedTraining = JSON.parse(selectedTraining);
      if (parsedTraining?.trainingID) {
        setTrainingId(parsedTraining.trainingID);
        setCompanyId(parsedTraining.companyID);

        axios
          .get(`${backendUrl}/admin/getTraineesForTraining/${parsedTraining.trainingID}`)
          .then((response) => {
            if (response.data.data) {
              setTrainees(response.data.data);
              // console.log(response.data.data)
              setSnackbarMessage("Trainees fetched successfully!");
              setSnackbarOpen(true);
            } else {
              setSnackbarMessage("No trainees found.");
              setSnackbarOpen(true);
            }
          })
          .catch((error) => {
            setSnackbarMessage("Error fetching trainees.");
            setSnackbarOpen(true);
          });
      }
    }
  }, []);

  const handleConfirmTrainee = () => {
    if (!newTrainee.name || !newTrainee.email || !newTrainee.phone || !newTrainee.password) {
      setSnackbarMessage("Please fill out all fields.");
      setSnackbarOpen(true);
      return;
    }

    const traineeData = {
      TrainingID: trainingId,
      CompanyID: companyId,
      Name: newTrainee.name,
      Email: newTrainee.email,
      PhoneNumber: newTrainee.phone,
    };

    setModalOpen(false);

    axios
      .post(`${backendUrl}/admin/saveTrainee`, traineeData)
      .then((response) => {
        if (response.status) {
          setTrainees((prevTrainees) => [
            ...prevTrainees,
            {
              Name: newTrainee.name,
              Email: newTrainee.email,
              PhoneNumber: newTrainee.phone,
              password: newTrainee.password,
            },
          ]);
          setSnackbarMessage("Trainee added successfully!");
          setSnackbarOpen(true);

          const traineeId = response.data.data;

          const userData = {
            email: newTrainee.email,
            password: newTrainee.password,
            position: "trainee",
            id: traineeId,
          };

          axios
            .post(`${backendUrl}/users`, userData)
            .then((userResponse) => {
              if (userResponse.status) {
                setSnackbarMessage("Trainee and user account created successfully!");
                setSnackbarOpen(true);
              } else {
                setSnackbarMessage("Trainee saved, but failed to create user account.");
                setSnackbarOpen(true);
              }
            })
            .catch((userError) => {
              setSnackbarMessage("Trainee saved, but error creating user account.");
              setSnackbarOpen(true);
            });

          setNewTrainee({ name: "", email: "", phone: "", password: "" });
        } else {
          setSnackbarMessage("Failed to add trainee.");
          setSnackbarOpen(true);
        }
      })
      .catch(() => {
        setSnackbarMessage("Error saving trainee.");
        setSnackbarOpen(true);
      });
  };

  const handleDisallow = async() => {
      try {
        // console.log(selectedTrainees)

        await axios.post(`${backendUrl}/admin/disallowLogin`, {
          TraineeIDs: selectedTrainees,
        });
        setSnackbarMessage("Login disallowed for selected trainees.");
        setSnackbarOpen(true);
        // console.log("abcd")
      } catch {
        setSnackbarMessage("Failed to disallow login.");
        setSnackbarOpen(true);
      }
    }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let parsedData = XLSX.utils.sheet_to_json(sheet);

      parsedData = parsedData.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.trim(), value])
        )
      );

      const traineesFromFile = parsedData.map((row) => ({
        Name: row.Name || row.name || "Unknown",
        Email: row.Email || row.email || "No Email",
        PhoneNumber: row.Phone || row.phone || "No Phone",
        password: "12345",
      }));

      const traineesForRequest = parsedData.map((row) => ({
        Name: row.Name || row.name || "Unknown",
        Email: row.Email || row.email || "No Email",
        PhoneNumber: row.Phone || row.phone || "No Phone",
      }));

      const requestData = {
        TrainingID: trainingId,
        CompanyID: companyId,
        trainees: traineesForRequest,
      };

      try {
        const response = await axios.post(
          `${backendUrl}/admin/saveAllTrainees`,
          requestData
        );

        if (response.status) {
          const traineeIdsofeach = response.data.data;
          setTrainees((prevTrainees) => [...prevTrainees, ...traineesFromFile]);

          for (const [index, trainee] of traineesFromFile.entries()) {
            const userData = {
              email: trainee.Email,
              password: trainee.password,
              position: "trainee",
              id: traineeIdsofeach[index],
            };

            try {
              await axios.post(`${backendUrl}/users`, userData);
            } catch (error) {
              console.error(`Error creating user for ${trainee.Email}:`, error);
            }
          }

          setSnackbarMessage("All trainees and user accounts added successfully!");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Failed to add trainees.");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage("Error adding trainees.");
        setSnackbarOpen(true);
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };

  // const handleDeleteTrainee = (index) => {
  //   setTrainees(trainees.filter((_, i) => i !== index));
  // };

  const togglePasswordVisibility = (index) => {
    setPasswordVisible((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
    }));
};


  const filteredTrainees = trainees.filter((trainee) =>
    trainee.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles />
    <Box
      sx={{
        padding: { xs: 2, sm: 4, md: 6 },
        minHeight: "100vh",
        height:"auto",
        backgroundColor: "#f4f4f4",
        color: "#2b6777",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: { xs: 4, md: 6 },
          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        Participant Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Search Participant by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            maxWidth: "500px",
            mx: { xs: 1, sm: "auto" },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenModal}
          sx={{
            backgroundColor: "#2b6777",
            color: "white",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Add Participant
        </Button>
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: "#2b6777",
            color: "white",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Upload Excel
          <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
        </Button>
        <Button
    variant="contained"
    onClick={() => {
      if (selectedTrainees.length === trainees.length) {
        setSelectedTrainees([]);
      } else {
        setSelectedTrainees(trainees.map((t) => t.TraineeID));
      }
    }}
    sx={{
      backgroundColor: "#2b6777",
      color: "white",
      width: { xs: "100%", sm: "auto" },
    }}
  >
    {selectedTrainees.length === trainees.length ? "Deselect All" : "Select All"}
  </Button>
  <Button
    variant="contained"
    onClick={handleDisallow}
    sx={{
      backgroundColor: "#2b6777",
      color: "white",
      width: { xs: "100%", sm: "auto" },
    }}
  >
    Disallow Login
  </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(220px, 1fr))",
          },
        }}
      >
        {filteredTrainees.map((trainee, index) => (
          <Paper
          key={index}
          elevation={4}
          sx={{
            padding: 3,
            borderRadius: "15px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <Box sx={{ position: "absolute", top: 10, left: 10 }}>
            <input
              type="checkbox"
              checked={selectedTrainees.includes(trainee.TraineeID)}
              onChange={(e) => {
                const updatedSelection = e.target.checked
                  ? [...selectedTrainees, trainee.TraineeID]
                  : selectedTrainees.filter((TraineeID) => TraineeID !== trainee.TraineeID);
                setSelectedTrainees(updatedSelection);
              }}
            />
          </Box>
          <PersonIcon sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
            {trainee.Name}
          </Typography>
          <Typography sx={{ wordBreak: "break-word" }}>{trainee.Email}</Typography>
          <Typography sx={{ wordBreak: "break-word" }}>{trainee.PhoneNumber}</Typography>
        </Paper>
        
        ))}
      </Box>

      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Participant</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newTrainee.name}
            onChange={(e) => setNewTrainee({ ...newTrainee, name: e.target.value, password: "12345" })}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={newTrainee.email}
            onChange={(e) => setNewTrainee({ ...newTrainee, email: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Phone"
            fullWidth
            value={newTrainee.phone}
            onChange={(e) => setNewTrainee({ ...newTrainee, phone: e.target.value })}
            margin="normal"
          />
          {/* <TextField
            label="Password"
            fullWidth
            value={newTrainee.password}
            onChange={(e) => setNewTrainee({ ...newTrainee, password: e.target.value })}
            margin="normal"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleConfirmTrainee}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="success" onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </ThemeProvider>
  );
};

export default TraineePage;