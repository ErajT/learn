import React, { useEffect, useState } from "react";
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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const MAX_MATERIALS = 6;

  useEffect(() => {
    const initialMaterials = [
      {
        id: 1,
        title: "Sample PDF",
        description: "A sample PDF document",
        fileName: "sample1.pdf",
        fileUrl: "#",
      },
      {
        id: 2,
        title: "Worksheet",
        description: "An example worksheet",
        fileName: "worksheet.docx",
        fileUrl: "#",
      },
    ];
    setMaterials(initialMaterials);
  }, []);

  const handleUpload = () => {
    if (materials.length >= MAX_MATERIALS) {
      setSnackbarMessage(`Upload limit of ${MAX_MATERIALS} materials reached.`);
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

    const newMaterialEntry = {
      id: materials.length + 1,
      title: newMaterial,
      description: description || `Description of ${newMaterial}`,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
    };

    setMaterials([newMaterialEntry, ...materials]);
    setNewMaterial("");
    setDescription("");
    setFile(null);
    setSnackbarMessage("Material uploaded successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setMaterials(materials.filter((m) => m.id !== materialToDelete.id));
    setDeleteDialogOpen(false);
    setMaterialToDelete(null);
    setSnackbarMessage("Material deleted successfully.");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setMaterialToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
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
        Material Management
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              borderRadius: 3,
              background: "linear-gradient(to right, #e1eef6, #ffffff)",
              color: "#2b6777",
              boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
              }}
            >
              <IconButton
                size="large"
                sx={{
                  color: "#2b6777",
                  backgroundColor: "rgba(43, 103, 119, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(43, 103, 119, 0.2)",
                  },
                }}
              >
                <UploadFileIcon fontSize="large" />
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="center"
              mb={3}
            >
              Upload New Material
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#777",
                textAlign: "center",
                mb: 2,
              }}
            >
              {`You can upload ${MAX_MATERIALS - materials.length} more material(s).`}
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
              inputProps={{ accept: ".pdf,.doc,.docx,.txt" }}
              onChange={(e) => setFile(e.target.files[0])}
              sx={{
                mb: 3,
                "::file-selector-button": {
                  backgroundColor: "#2b6777",
                  color: "white",
                  borderRadius: 3,
                  padding: "5px 15px",
                  cursor: "pointer",
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleUpload}
              fullWidth
              sx={{
                fontWeight: "bold",
                textTransform: "capitalize",
                backgroundColor: "#2b6777",
                color: "white",
                "&:hover": {
                  backgroundColor: "#225866",
                },
              }}
            >
              Upload Material
            </Button>
          </Paper>
        </Grid>

        {/* Display Section */}
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
                      variant="h6"
                      sx={{
                        color: "#2b6777",
                        fontWeight: "bold",
                      }}
                    >
                      {material.title}
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
                    sx={{ color: "#777777", mb: 2, textAlign: "center" }}
                  >
                    {material.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    href={material.fileUrl}
                    target="_blank"
                    sx={{
                      backgroundColor: "#2b6777",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#225866",
                      },
                    }}
                  >
                    View {material.fileName}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Delete Material</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this material?
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
  );
};

export default MaterialPage;
