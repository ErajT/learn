import React, { useState } from "react";
import * as XLSX from "xlsx";
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

const TraineePage = () => {
  const [trainees, setTrainees] = useState([]);
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
  const [passwordVisible, setPasswordVisible] = useState({});

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleConfirmTrainee = () => {
    if (!newTrainee.name || !newTrainee.email || !newTrainee.phone || !newTrainee.password) {
      setSnackbarMessage("Please fill out all fields.");
      setSnackbarOpen(true);
      return;
    }
    setTrainees([...trainees, newTrainee]);
    setSnackbarMessage("Trainee added successfully!");
    setSnackbarOpen(true);
    setModalOpen(false);
    setNewTrainee({ name: "", email: "", phone: "", password: "" });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return; // If no file is selected, return early
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let parsedData = XLSX.utils.sheet_to_json(sheet);

      // Trim keys to remove extra spaces
      parsedData = parsedData.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.trim(), value])
        )
      );

      console.log("Parsed Data: ", parsedData);

      const traineesFromFile = parsedData.map((row) => ({
        name: row.Name || row.name || "Unknown",
        email: row.Email || row.email || "No Email",
        phone: row.Phone || row.phone || "No Phone",
        password: "12345", // Default password for imported trainees
      }));

      setTrainees((prevTrainees) => [...prevTrainees, ...traineesFromFile]);

      setSnackbarMessage("Trainees imported successfully!");
      setSnackbarOpen(true);
    };

    reader.readAsArrayBuffer(file);

    // Reset the file input value to allow uploading the same file again
    event.target.value = "";
  };

  const handleDeleteTrainee = (index) => {
    setTrainees(trainees.filter((_, i) => i !== index));
  };

  const togglePasswordVisibility = (index) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const filteredTrainees = trainees.filter((trainee) =>
    trainee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4, md: 6 },
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        color: "#2b6777",
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: { xs: 4, md: 6 },
          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        Trainee Management
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Search Trainee by Name"
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

      {/* Buttons */}
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
          Add Trainee
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
      </Box>

      {/* Trainee Cards */}
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
            <IconButton
              onClick={() => handleDeleteTrainee(index)}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <DeleteIcon />
            </IconButton>
            <PersonIcon sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
              {trainee.name}
            </Typography>
            <Typography sx={{ wordBreak: "break-word" }}>{trainee.email}</Typography>
            <Typography sx={{ wordBreak: "break-word" }}>{trainee.phone}</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1 }}>
              <Typography>Password: </Typography>
              <IconButton onClick={() => togglePasswordVisibility(index)}>
                {passwordVisible[index] ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
              {passwordVisible[index] ? trainee.password : "••••••••"}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Add Trainee Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Trainee</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newTrainee.name}
            onChange={(e) => setNewTrainee({ ...newTrainee, name: e.target.value })}
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
          <TextField
            label="Password"
            fullWidth
            value={newTrainee.password}
            onChange={(e) => setNewTrainee({ ...newTrainee, password: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleConfirmTrainee}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="success" onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TraineePage;