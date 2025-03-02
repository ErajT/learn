import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { backendUrl } from "./constants";

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

const MaterialPage = () => {
    const tok = Cookies.get("token");
    const token = JSON.parse(tok);
  // const backendUrl = "http://localhost:2000";  // Use this in API calls

  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [trainingId, setTrainingId] = useState(null);

  const MAX_MATERIALS = 6;

  useEffect(() => {
    const selectedTraining = Cookies.get("selectedTraining");
    if (selectedTraining) {
      const parsedTraining = JSON.parse(selectedTraining);
      if (parsedTraining?.trainingID) {
        setTrainingId(parsedTraining.trainingID);
        fetchMaterials(parsedTraining.trainingID);
      }
    }
  }, []);

  const fetchMaterials = async (trainingId) => {
    try {
      console.log(token);
      const response = await fetch(
        `${backendUrl}/admin/getMaterial/${trainingId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`},
        });

      if (response.ok) {
        const data = await response.json();
        // console.log(data.materials);
      
        // Add id to each material starting from 1
        const materialsWithId = (data.materials || []).map((material, index) => ({
          ...material,
          id: index + 1, // Start id from 1
        }));
      
        setMaterials(materialsWithId); // Gracefully handle empty data
      } else {
        setMaterials([]);
      }
      
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

 
  const handleUpload = async () => {
    if (materials.length >= MAX_MATERIALS) {
      setSnackbarMessage(`Upload limit of ${MAX_MATERIALS} content reached.`);
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    if (newMaterial.trim() === "" || !file) {
      setSnackbarMessage("Please fill out all fields and attach a file.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("TrainingID", trainingId);
    formData.append("Title", newMaterial);
    formData.append("Description", description || "No description provided");
    formData.append("material", file);

    try {
      const response = await fetch(`${backendUrl}/admin/addMaterial`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}`},
      });

      console.log(response);

      if (response.ok) {
        const addedMaterial = await response.json();
        setSnackbarMessage("Content uploaded successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setNewMaterial("");
        setDescription("");
        setFile(null);

        // Refetch materials to show the updated list
        fetchMaterials(trainingId);
      } else {
        const errorResponse = await response.json();
        setSnackbarMessage(errorResponse.message || "Upload failed.");
        console.log(errorResponse.error);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error uploading content:", error);
      setSnackbarMessage("Failed to upload content. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  
const confirmDelete = async () => {
  if (!materialToDelete || !trainingId) return;

  try {
    // console.log(materialToDelete);
    const response = await axios.get(
      `${backendUrl}/admin/deleteMaterial/${trainingId}/${materialToDelete.id}`,{
      headers: { Authorization: `Bearer ${token}`},}
    );

    if (response.status === 200) {
      setMaterials(materials.filter((m) => m.id !== materialToDelete.id));
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
      setSnackbarMessage("Content deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Refetch materials to show the updated list
      fetchMaterials(trainingId);
    } else {
      setSnackbarMessage(response.data?.message || "Failed to delete content.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  } catch (error) {
    console.error("Error deleting content:", error);
    setSnackbarMessage(
      error.response?.data?.message || "Failed to delete content. Please try again."
    );
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  } finally {
    setDeleteDialogOpen(false);
    setMaterialToDelete(null);
  }
};

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setMaterialToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Convert the base64 to a Blob URL for viewing in an iframe
  const handleViewFile = (base64File) => {
    const byteCharacters = atob(base64File); // decode base64
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' }); // Assuming the file is a PDF
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, '_blank');
  };

  return (
    <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles />
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        color: "#2b6777",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 6,
          textShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
        }}
      >
        Learning Content
      </Typography>

      <Grid container spacing={4}>
        {/* Upload New Material */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              margin: "0 auto",
              borderRadius: 3,
              background: "linear-gradient(to right, #e1eef6, #ffffff)",
              color: "#2b6777",
            }}
          >
            <IconButton
              size="large"
              sx={{
                color: "#2b6777",
                margin: "0 auto",
                display: "block",
                backgroundColor: "rgba(43, 103, 119, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(43, 103, 119, 0.2)",
                },
              }}
            >
              <UploadFileIcon fontSize="large" />
            </IconButton>

            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={3}
            >
              Upload New Content
            </Typography>
            <TextField
              variant="outlined"
              label="Material Title"
              fullWidth
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              label="Material Description"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleUpload}
              fullWidth
              sx={{
                fontWeight: "bold",
                backgroundColor: "#2b6777",
                color: "white",
                fontSize:"1.1rem",
                "&:hover": { backgroundColor: "#225866" },
              }}
            >
              Upload Content
            </Button>
          </Paper>
        </Grid>

        {/* Display Materials */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            {materials.map((material) => (
              <Grid item xs={12} sm={6} md={4} key={material.id}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 3,
                    borderRadius: 3,
                    background: "#ffffff",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease-in-out",
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#2b6777",
                        fontWeight: "bold",
                        

                      }}
                    >
                      Title:{material.Title}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(material)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#777777", mb: 2, textAlign: "center",fontSize:"1.3rem" }}
                  >
                    Description:{material.Description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleViewFile(material.File)} // Pass base64 to view
                    sx={{
                      backgroundColor: "#2b6777",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#225866",
                      },
                    }}
                  >
                    View Content
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Delete Content</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Content?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </ThemeProvider>
  );
};

export default MaterialPage;
