import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({});
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setNewTrainee({ name: "", email: "", phone: "", password: "" });
    setIsEmailValid(true);
    setIsPhoneValid(true);
    setIsPasswordValid(false);
    setHasUppercase(false);
    setHasNumber(false);
    setIsLengthValid(false);
    setModalOpen(false);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(emailRegex.test(email));
  };
  const validatePhone = (phone) => {
    setIsPhoneValid(phone.length === 11 && !isNaN(phone));
  };
  const validatePassword = (password) => {
    setIsLengthValid(password.length >= 8);
    setHasUppercase(/[A-Z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
    setIsPasswordValid(isLengthValid && hasUppercase && hasNumber);
  };
  const handleConfirmTrainee = () => {
    if (!newTrainee.name.trim() || !newTrainee.email.trim() || !newTrainee.phone.trim() || !newTrainee.password.trim()) {
      setSnackbarMessage("Please fill out all trainee details.");
      setSnackbarOpen(true);
      return;
    }

    if (!isEmailValid || !isPhoneValid || !isPasswordValid) {
      setSnackbarMessage("Please correct the errors before confirming.");
      setSnackbarOpen(true);
      return;
    }

    setTrainees([...trainees, newTrainee]);
    setSnackbarMessage("Trainee added successfully!");
    setSnackbarOpen(true);
    handleCloseModal();
  };
  const handleDeleteTrainee = (index) => {
    setTrainees(trainees.filter((_, i) => i !== index));
  };
  const filteredTrainees = trainees.filter((trainee) =>
    trainee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const togglePasswordVisibility = (index) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box
      sx={{
        padding: 6,
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        color: "#2b6777",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 6,
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        Trainee Management
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
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
            "& .MuiOutlinedInput-root": {
              borderRadius: 5,
              "&:hover fieldset": { borderColor: "#2b6777" },
            },
          }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenModal}
          sx={{
            fontWeight: "bold",
            backgroundColor: "#2b6777",
            color: "white",
            "&:hover": { backgroundColor: "#225866" },
          }}
        >
          Upload Trainee Info
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {filteredTrainees.map((trainee, index) => (
          <Paper
            key={index}
            elevation={4}
            sx={{
              padding: 3,
              background: "linear-gradient(to right, #e1eef6, #ffffff)",
              color: "#2b6777",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => handleDeleteTrainee(index)}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "#d32f2f",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
              }}
            >
              <DeleteIcon />
            </IconButton>
            <PersonIcon
              sx={{
                fontSize: 50,
                color: "#2b6777",
                mb: 2,
                backgroundColor: "rgba(43, 103, 119, 0.1)",
                borderRadius: "50%",
                padding: 1,
              }}
            />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              {trainee.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#777" }}>
              {trainee.email}
            </Typography>
            <Typography variant="body2" sx={{ color: "#777" }}>
              {trainee.phone}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography variant="body2" sx={{ color: "#777" }}>
                Password:{" "}
              </Typography>
              <IconButton
                onClick={() => togglePasswordVisibility(index)}
                sx={{ color: "#2b6777", ml: 1 }}
              >
                {passwordVisible[index] ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
              {passwordVisible[index] ? trainee.password : "••••••••"}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add New Trainee</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newTrainee.name}
            onChange={(e) => setNewTrainee({ ...newTrainee, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={newTrainee.email}
            onChange={(e) => {
              setNewTrainee({ ...newTrainee, email: e.target.value });
              validateEmail(e.target.value);
            }}
            margin="normal"
            error={!isEmailValid}
            helperText={!isEmailValid ? "Invalid email format" : ""}
          />
          <TextField
            fullWidth
            label="Phone"
            value={newTrainee.phone}
            onChange={(e) => {
              setNewTrainee({ ...newTrainee, phone: e.target.value });
              validatePhone(e.target.value);
            }}
            margin="normal"
            error={!isPhoneValid}
            helperText={!isPhoneValid ? "Phone number must be 11 digits" : ""}
          />
          <TextField
            fullWidth
            label="Password"
            type={passwordVisible ? "text" : "password"}
            value={newTrainee.password}
            onChange={(e) => {
              setNewTrainee({ ...newTrainee, password: e.target.value });
              validatePassword(e.target.value);
            }}
            margin="normal"
            error={!isPasswordValid}
            helperText={!isPasswordValid ? "Password must be at least 8 characters long, with an uppercase letter and a number." : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleConfirmTrainee} disabled={!isEmailValid || !isPhoneValid || !isPasswordValid}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TraineePage;
