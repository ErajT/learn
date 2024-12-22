// import React from "react";
// import styled from "styled-components";

// const LeaderboardContainer = styled.div`
//   background-color: #2b6777;
//   color: #ffffff;
//   width: 100%;
//   height: 100vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: flex-start;
//   padding-top: 100px;
//   box-sizing: border-box;

//   @media (max-width: 768px) {
//     padding-top: 100px; 
//   }
// `;

// const Title = styled.h1`
//   font-size: 3rem;
//   font-weight: 700;
//   color: #b0b9da;
//   text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
//   margin-bottom: 50px;

//   @media (max-width: 768px) {
//     font-size: 2.5rem;
//     margin-bottom: 40px;
//   }
// `;

// const LeaderboardItem = styled.div`
//   width: 90%;
//   max-width: 600px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-bottom: 15px;
//   padding: 10px;
//   background-color: #b0b9da;
//   border-radius: 10px;
//   box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
//   box-sizing: border-box;

//   @media (max-width: 768px) {
//     padding: 8px;
//   }
// `;

// const Rank = styled.div`
//   font-size: 1.5rem;
//   font-weight: bold;
//   color: #2b6777;
//   width: 50px;
//   text-align: center;

//   @media (max-width: 768px) {
//     font-size: 1.2rem;
//   }
// `;

// const Name = styled.div`
//   font-size: 1.2rem;
//   font-weight: 600;
//   color: #2b6777;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   flex: 1;

//   @media (max-width: 768px) {
//     font-size: 1rem;
//   }
// `;

// const ProgressContainer = styled.div`
//   flex: 2;
//   background-color: #e5e7eb;
//   border-radius: 8px;
//   height: 12px;
//   position: relative;
//   overflow: hidden;
//   margin: 0 10px;
// `;

// const ProgressBar = styled.div`
//   height: 100%;
//   border-radius: 8px;
//   background-color: ${({ type }) => (type === "positive" ? "#3CB371" : "#FF6347")};
//   width: ${({ percentage }) => `${percentage}%`};
//   transition: width 0.5s ease-in-out;
// `;

// const Score = styled.div`
//   font-size: 1.2rem;
//   font-weight: bold;
//   color: #2b6777;
//   text-align: right;
//   width: 60px;

//   @media (max-width: 768px) {
//     font-size: 1rem;
//   }
// `;

// const FullLeaderboard = () => {
//   const leaderboardData = [
//     { rank: 1, name: "ABCD", emoji: "", score: 6960, positive: 70 },
//     { rank: 2, name: "Da", emoji: "", score: 5243, positive: 60 },
//     { rank: 3, name: "Captain", emoji: "", score: 4940, positive: 50 },
//     { rank: 4, name: "Fl", emoji: "", score: 4707, positive: 55 },
//     { rank: 5, name: "Ka", emoji: "", score: 3831, positive: 40 },
//     { rank: 6, name: "Sh", emoji: "", score: 2804, positive: 30 },
//   ];

//   return (
//     <LeaderboardContainer>
//       <Title>Full Leaderboard</Title>
//       {leaderboardData.map((player) => (
//         <LeaderboardItem key={player.rank}>
//           <Rank>{player.rank}</Rank>
//           <Name>
//             {player.name} {player.emoji}
//           </Name>
//           <ProgressContainer>
//             <ProgressBar type="positive" percentage={player.positive} />
//             <ProgressBar type="negative" percentage={100 - player.positive} />
//           </ProgressContainer>
//           <Score>{player.score}</Score>
//         </LeaderboardItem>
//       ))}
//     </LeaderboardContainer>
//   );
// };

// export default FullLeaderboard;

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const TrainingManager = () => {
  const [openModal, setOpenModal] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [newTraining, setNewTraining] = useState({
    name: "",
    trainer: "",
    imageUrl: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleAddTraining = () => {
    if (newTraining.name && newTraining.trainer && newTraining.imageUrl) {
      setTrainings([...trainings, newTraining]);
      setNewTraining({ name: "", trainer: "", imageUrl: "" });
      handleCloseModal();
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
          marginBottom: 3,
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
          {/* <Typography variant="body1">Manage all your trainings here</Typography> */}
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
          >
            <CardMedia
              component="img"
              image={training.imageUrl}
              alt={training.name}
              sx={{
                height: "60%",
                width: "100%",
                objectFit: "cover",
              }}
            />
            <CardContent
              sx={{
                height: "40%",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                {training.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Trainer: {training.trainer}
              </Typography>
            </CardContent>
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "white",
                ":hover": { backgroundColor: "red", color: "white" },
              }}
              onClick={() => openDeleteDialog(index)}
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
            label="Training Name"
            fullWidth
            variant="outlined"
            margin="dense"
            value={newTraining.name}
            onChange={(e) =>
              setNewTraining({ ...newTraining, name: e.target.value })
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
            label="Image URL"
            fullWidth
            variant="outlined"
            margin="dense"
            value={newTraining.imageUrl}
            onChange={(e) =>
              setNewTraining({ ...newTraining, imageUrl: e.target.value })
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
