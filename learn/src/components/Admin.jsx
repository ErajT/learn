import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, TextField, IconButton, Dialog, DialogTitle, DialogActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

const TrainingManager = () => {
  const backendUrl = "https://64f9-116-90-103-244.ngrok-free.app";  // Use this in API calls
  const [openModal, setOpenModal] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [newTraining, setNewTraining] = useState({
    trainer: "",
    companyName: "",
    topic: "",
    date: "",
    description: ""
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  useEffect(() => {
    // Fetch the trainings when the component mounts
    axios.get('${backendUrl}/admin/getAllTrainings')
      .then(response => {
        if (response.data.status === "success") {
          const fetchedTrainings = response.data.trainings.map(training => ({
            name: training.Topic,
            trainer: training.TrainerName,
            company: training.CompanyName,
            date: new Date(training.Date).toLocaleDateString(), // Format the date
            companyId: training.CompanyID, // Assuming CompanyId is present
            trainingId: training.TrainingID // Assuming TrainingId is present
          }));
          setTrainings(fetchedTrainings);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the trainings:", error);
      });
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddTraining = async () => {
    if (newTraining.trainer && newTraining.companyName && newTraining.topic && newTraining.date && newTraining.description) {
      try {
        // First, post the new training
        const response = await axios.post('${backendUrl}/admin/addTraining', {
          companyName: newTraining.companyName,
          TrainerName: newTraining.trainer,
          Topic: newTraining.topic,
          Date: newTraining.date,
          Description: newTraining.description
        });

        if (response.data.status === "success") {
          // After successfully adding the training, fetch the updated list
          axios.get('${backendUrl}/admin/getAllTrainings')
            .then(response => {
              if (response.data.status === "success") {
                const fetchedTrainings = response.data.trainings.map(training => ({
                  name: training.Topic,
                  trainer: training.TrainerName,
                  company: training.CompanyName,
                  date: new Date(training.Date).toLocaleDateString(), // Format the date
                  companyId: training.CompanyID, // Assuming CompanyId is present
                  trainingId: training.trainingID // Assuming TrainingId is present
                }));
                setTrainings(fetchedTrainings);
              }
            })
            .catch(error => {
              console.error("There was an error fetching the trainings:", error);
            });

          // Reset form fields and close the modal
          setNewTraining({ topic: "", trainer: "", companyName: "", date: "", description: "" });
          handleCloseModal();
        } else {
          console.error("Failed to add training");
        }
      } catch (error) {
        console.error("Error adding training:", error);
      }
    }
  };

  const handleDeleteTraining = (index) => {
    const updatedTrainings = trainings.filter((_, i) => i !== index);
    setTrainings(updatedTrainings);
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (index) => {
    setTrainingToDelete(index);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  const handleTrainingClick = (training) => {
    console.log(training);
    // Save the training details including companyId and trainingId in a cookie
    const trainingDetails = {
      trainingID: training.trainingId, // Corrected to use the actual field name
      companyID: training.companyId,  // Corrected to use the actual field name
      name: training.name,
      trainer: training.trainer,
      company: training.company,
      date: training.date
    };

    // Save to cookie for 7 days
    Cookies.set('selectedTraining', JSON.stringify(trainingDetails), { expires: 7 });
  };

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: 3 }}>
      <Box
        component="header"
        sx={{
  backgroundImage: "url('/back.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: 250,
  borderRadius: 2,
  marginBottom: 4,
  marginTop: 8, // Adds gap from the top
  position: "relative",
}}
      >
        <Box
          sx={{
            position: "absolute",
            top: "70%",
            left: "2%",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Training Manager
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        sx={{
          justifyContent: "start",
        }}
      >
        <Box
          sx={{
            flex: "0 1 calc(20% - 16px)",
            minWidth: 200,
            height: 250,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "2px dashed #ccc",
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.3s",
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#f0f4ff",
              borderColor: "#3f51b5",
            },
          }}
          onClick={handleOpenModal}
        >
          <AddCircleOutlineIcon
            sx={{ fontSize: 50, color: "#3f51b5", marginBottom: 1 }}
          />
          <Typography variant="h6" color="#3f51b5">
            Create Training
          </Typography>
        </Box>
        {trainings.map((training, index) => (
          <Box
            key={index}
            sx={{
              flex: "0 1 calc(20% - 16px)",
              minWidth: 200,
              height: 250,
              position: "relative",
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => handleTrainingClick(training)} // Save details on click
          >
            <Link to="/Training" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  padding: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                  {training.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Company: {training.company}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Trainer: {training.trainer}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Date: {training.date}
                </Typography>
              </Box>
            </Link>
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "white",
                ":hover": { backgroundColor: "red", color: "white" },
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent routing when clicking delete icon
                openDeleteDialog(index);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: "90%",
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" fontWeight="bold" marginBottom={2}>
            Add Training
          </Typography>
          <TextField
            label="Topic"
            fullWidth
            variant="outlined"
            margin="dense"
            value={newTraining.topic}
            onChange={(e) =>
              setNewTraining({ ...newTraining, topic: e.target.value })
            }
          />
          <TextField
            label="Trainer Name"
            fullWidth
            variant="outlined"
            margin="dense"
            value={newTraining.trainer}
            onChange={(e) =>
              setNewTraining({ ...newTraining, trainer: e.target.value })
            }
          />
          <TextField
            label="Company Name"
            fullWidth
            variant="outlined"
            margin="dense"
            value={newTraining.companyName}
            onChange={(e) =>
              setNewTraining({ ...newTraining, companyName: e.target.value })
            }
          />
          <TextField
            label=""
            fullWidth
            variant="outlined"
            margin="dense"
            type="date"
            value={newTraining.date}
            onChange={(e) =>
              setNewTraining({ ...newTraining, date: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            margin="dense"
            value={newTraining.description}
            onChange={(e) =>
              setNewTraining({ ...newTraining, description: e.target.value })
            }
          />
          <Box textAlign="center" marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTraining}
            >
              Add Training
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Are you sure you want to delete this training?
        </DialogTitle>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteTraining(trainingToDelete)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingManager;
