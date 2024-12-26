import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Make sure to import Cookies if not already done
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
  const [trainingId, setTrainingId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [traineeIds, setTraineeIds] = useState(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Fetch trainees when component mounts or trainingId changes
  useEffect(() => {
    const selectedTraining = Cookies.get("selectedTraining");
    if (selectedTraining) {
      const parsedTraining = JSON.parse(selectedTraining);
      if (parsedTraining?.trainingID) {
        setTrainingId(parsedTraining.trainingID);
        // console.log(parsedTraining);
        setCompanyId(parsedTraining.companyID);

        console.log(parsedTraining.trainingID);
        
        axios
        .get(`http://localhost:2000/admin/getTraineesForTraining/${parsedTraining.trainingID}`)
        .then((response) => {
          if (response.data) {
            console.log(response.data.data);
            setTrainees(response.data.data); // Assuming the API response contains a 'trainees' field
            setSnackbarMessage("Trainees fetched successfully!");
            setSnackbarOpen(true);
          } else {
            setSnackbarMessage("Failed to fetch trainees.");
            setSnackbarOpen(true);
          }
        })
        .catch((error) => {
          setSnackbarMessage("Error fetching trainees.");
          setSnackbarOpen(true);
        });
    }
  }
}, []); // Dependency array left empty to run only once when component mounts

const handleConfirmTrainee = () => {
  // Validate the new trainee data
  if (!newTrainee.name || !newTrainee.email || !newTrainee.phone || !newTrainee.password) {
    setSnackbarMessage("Please fill out all fields.");
    setSnackbarOpen(true);
    return;
  }

  // Prepare the data to send in the POST request
  const traineeData = {
    TrainingID: trainingId, // TrainingID from state
    CompanyID: companyId, // Replace this with the actual CompanyID if needed
    Name: newTrainee.name,
    Email: newTrainee.email,
    PhoneNumber: newTrainee.phone,
  };
  setModalOpen(false);

  // console.log(traineeData);

  // Make the POST request to save the trainee
  axios
    .post("http://localhost:2000/admin/saveTrainee", traineeData)
    .then((response) => {
      // console.log(response);
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
         // Save the trainee ID
         const traineeId = response.data.data; // Assuming `response.data.data` contains the trainee ID
         setTraineeIds(traineeId);
 
         // Prepare data for the second API
         const userData = {
           email: newTrainee.email,
           password: newTrainee.password,
           position: "trainee",
           id: traineeId,
         };
 
         // Make the second API call to create the user
         axios
           .post("http://localhost:2000/users", userData)
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
             console.error("User API error:", userError);
           });
 
        setNewTrainee({ name: "", email: "", phone: "", password: "" });
      } else {
        setSnackbarMessage("Failed to add trainee.");
        setSnackbarOpen(true);
      }
    })
    .catch((error) => {
      setSnackbarMessage("Error saving trainee.");
      setSnackbarOpen(true);
    });
};



// const handleFileUpload = (event) => {
//   const file = event.target.files[0];
//   if (!file) return; // If no file is selected, return early
//   const reader = new FileReader();

//   reader.onload = (e) => {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: "array" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     let parsedData = XLSX.utils.sheet_to_json(sheet);

//     // Trim keys to remove extra spaces
//     parsedData = parsedData.map((row) =>
//       Object.fromEntries(
//         Object.entries(row).map(([key, value]) => [key.trim(), value])
//       )
//     );

//     console.log("Parsed Data: ", parsedData);

//     // Prepare the trainees array without the password field
//     const traineesFromFile = parsedData.map((row) => ({
//       Name: row.Name || row.name || "Unknown",
//       Email: row.Email || row.email || "No Email",
//       PhoneNumber: row.Phone || row.phone || "No Phone",
//       password: "12345"
//     }));

//     const traineesFromFile1 = parsedData.map((row) => ({
//       Name: row.Name || row.name || "Unknown",
//       Email: row.Email || row.email || "No Email",
//       PhoneNumber: row.Phone || row.phone || "No Phone",
//     }));

//     // Prepare data for POST request
//     const requestData = {
//       TrainingID: trainingId, // Assuming trainingId is available in your state
//       CompanyID: companyId, // Replace this with the actual CompanyID if needed
//       trainees: traineesFromFile1,
//     };

//     // setTrainees((prevTrainees) => [...prevTrainees, ...traineesFromFile]);

//     setSnackbarMessage("Trainees imported successfully!");
//     setSnackbarOpen(true);

//     // Make the POST request to add multiple trainees
//     axios
//       .post("http://localhost:2000/admin/saveAllTrainees", requestData)
//       .then((response) => {
//         if (response.status) {
//           setTrainees((prevTrainees) => [...prevTrainees, ...traineesFromFile]);
//           console.log(response.data.data);
//           const traineeIdsofeach = response.data.data;
//           // Loop through trainees and make an additional API call for each
//           const userPromises = traineesFromFile.map((trainee, index) => {
//             const userData = {
//               email: trainee.Email,
//               password: trainee.password,
//               designation: "trainee",
//               id: traineeIdsofeach[index], // Use the corresponding trainee ID
//             };

//             console.log(userPromises);

//             return axios
//               .post("http://localhost:2000/users", userData)
//               .then((userResponse) => {
//                 if (!userResponse.status) {
//                   console.error(`Failed to create user for ${trainee.Email}`);
//                 }
//               })
//               .catch((error) => {
//                 console.error(`Error creating user for ${trainee.Email}:`, error);
//               });
//           });

//           // Wait for all user API calls to complete
//           Promise.all(userPromises)
//             .then(() => {
//               setSnackbarMessage("All trainees and user accounts added successfully!");
//               setSnackbarOpen(true);
//             })
//             .catch(() => {
//               setSnackbarMessage("Some user accounts could not be created.");
//               setSnackbarOpen(true);
//             });
//         } else {
//           setSnackbarMessage("Failed to add trainees.");
//           setSnackbarOpen(true);
//         }
//       })
//       .catch((error) => {
//         setSnackbarMessage("Error adding trainees.");
//         setSnackbarOpen(true);
//       });
//   };

//   reader.readAsArrayBuffer(file);

//   // Reset the file input value to allow uploading the same file again
//   event.target.value = "";
// };

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return; // If no file is selected, return early
  const reader = new FileReader();

  reader.onload = async (e) => {
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

    // Prepare the trainees array
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

    // Prepare data for POST request
    const requestData = {
      TrainingID: trainingId, // Assuming trainingId is available in your state
      CompanyID: companyId, // Replace this with the actual CompanyID if needed
      trainees: traineesForRequest,
    };

    try {
      const response = await axios.post(
        "http://localhost:2000/admin/saveAllTrainees",
        requestData
      );

      if (response.status) {
        const traineeIdsofeach = response.data.data; // Trainee IDs from the backend
        setTrainees((prevTrainees) => [...prevTrainees, ...traineesFromFile]);

        // Loop through trainees and make an additional API call for each
        for (const [index, trainee] of traineesFromFile.entries()) {
          const userData = {
            email: trainee.Email,
            password: trainee.password,
            position: "trainee",
            id: traineeIdsofeach[index], // Use the corresponding trainee ID
          };

          try {
            const userResponse = await axios.post(
              "http://localhost:2000/users",
              userData
            );

            if (!userResponse.status) {
              console.error(`Failed to create user for ${trainee.Email}`);
            }
          } catch (error) {
            console.error(`Error creating user for ${trainee.Email}:`, error);
          }
        }

        // After all trainees are processed
        setSnackbarMessage(
          "All trainees and user accounts added successfully!"
        );
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Failed to add trainees.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Error adding trainees.");
      setSnackbarOpen(true);
      console.error("Error saving trainees:", error);
    }
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
        {trainees.map((trainee, index) => (
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
              {trainee.Name}
            </Typography>
            <Typography sx={{ wordBreak: "break-word" }}>{trainee.Email}</Typography>
            <Typography sx={{ wordBreak: "break-word" }}>{trainee.PhoneNumber}</Typography>
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
