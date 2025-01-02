import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { Visibility } from "@mui/icons-material";

const Container = styled.div`
  padding: 0 30px;
  margin: 0 auto;
`;

const UserInfoBox = styled.div`
  background: url('/back.png') no-repeat center center;
  background-size: cover;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 50px auto;
  display: flex;
  align-items: center;
  gap: 40px;
  height: 250px;

  @media (max-width: 1000px) {
    background: url('/back1.png') no-repeat center center;
    background-size: cover;
    gap: 20px;
    height: auto;
    flex-direction: column;
    padding: 1px;
    // margin: 10px 20px 10px 10px;
    width: auto;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  color: #fff;
  padding: 20px;

  h2 {
    margin: 10px;
    font-size: 2rem;
    font-weight: bold;
  }
  p {
    margin: 10px;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.3rem;
    }
    p {
      font-size: 1.3rem;
    }
  }
`;

const StyledCard = styled(Card)`
  border-radius: 24px !important; /* Increased radius for smoother corners */
  background: linear-gradient(to right, #e1eef6, #ffffff); /* Gradient for normal state */
  padding: 16px; /* Inner padding for better spacing */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Subtle shadow for depth */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; /* Smooth transitions */

  &:hover {
    transform: translateY(-10px); /* Slightly more elevation on hover */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
    background: linear-gradient(to right, #e1eef6, #ffffff); /* Keep the gradient consistent */
  }
`;


const HomePage = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls

  const [traineeDetails, setTraineeDetails] = useState({
    name: "",
    trainingName: "",
    companyName: "",
  });
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchDataAndSubscribe = async () => {
      // Fetch trainee details
      const traineeDetailsCookie = Cookies.get("traineeDetails");
      if (traineeDetailsCookie) {
        const parsedDetails = JSON.parse(traineeDetailsCookie);
        console.log(parsedDetails);
        setTraineeDetails({
          name: parsedDetails.Name || "",
          trainingName: parsedDetails.TrainingName || "",
          companyName: parsedDetails.CompanyName || "",
        });
      }
  
      // Fetch training materials
      const trainingID = JSON.parse(traineeDetailsCookie)?.TrainingID;
      if (trainingID) {
        try {
          const response = await axios.get(`${backendUrl}/admin/getMaterial/${trainingID}`);
          if (response.data.status === "success") {
            setMaterials(response.data.materials);
          }
        } catch (error) {
          console.error("Error fetching materials:", error);
        }
      }
  
      // Subscribe for push notifications
      if ("serviceWorker" in navigator) {
        console.log("called");
        await subscribeForPushNotifications(JSON.parse(traineeDetailsCookie)?.TraineeID);
      }
    };
  
    fetchDataAndSubscribe();
  }, []);
  


  const handleViewFile = (base64File) => {
    const byteCharacters = atob(base64File);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, '_blank');
  };

  async function subscribeForPushNotifications(traineeID) {
    try {
      console.log(traineeID);
      console.log("Registering service worker...");
      const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/",
      });
      console.log("Service Worker Registered...");
  
      console.log("Subscribing to push notifications...");
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo"
        ),
      });
  
      console.log("Subscription successful!", subscription);
  
      // Send subscription to backend
      const response = await axios.post(`${backendUrl}/leaderboard/saveSubscription`, {
        "subscription": subscription,
        "traineeID": traineeID
      });
      // await axios.post("/api/subscribe", subscription);
      console.log("Subscription object sent to backend.");
    } catch (error) {
      console.error("Failed to subscribe for push notifications:", error);
    }
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <Container>
      <UserInfoBox>
        <UserInfo>
          <p>
            <label>Participant's Name:</label> {traineeDetails.name}
          </p>
          <p>
            <label>Training Name:</label> {traineeDetails.trainingName}
          </p>
          <p>
            <label>Company Name:</label> {traineeDetails.companyName}
          </p>
        </UserInfo>
      </UserInfoBox>

      <Grid container spacing={4} style={{ marginTop: "40px", textAlign: "center"}}>
      {materials.length > 0 ? (
        materials.map((material, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard elevation={3} style={{background: "linear-gradient(to right, #e1eef6, #ffffff)" }}>
              <CardContent style={{background: "linear-gradient(to right, #e1eef6, #ffffff)" }}>
                <Typography
                  variant="h5"
                  // gutterBottom
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#2b6777", 
                    /* Darker color for better readability */
                  }}
                >
                  Title:{material.Title}
                </Typography>
                <Typography
                  variant="body1"
                  // color="textSecondary"
                  paragraph
                  style={{
                    textAlign: "justify",
                    marginBottom: "16px",
                    lineHeight: 1.6, /* Better line spacing */
                    color:"#2b6777",
                    fontWeight:"bold",
                    paddingBottom:"15px"
                  }}
                >
                  Description:{material.Description}
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#2b6777",
                    color: "#fff",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    padding: "8px 16px",
                  }}
                  startIcon={<Visibility style={{ color: "#fff" }} />}
                  onClick={() => handleViewFile(material.File)}
                >
                  View File
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))
      ) : (

          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary">
              No materials available for this training.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
