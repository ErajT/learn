import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";

const Container = styled.div`
  padding: 0 40px;
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

  @media (max-width: 768px) {
    background: url('/back1.png') no-repeat center center;
    background-size: cover;
    gap: 20px;
    height: auto;
    flex-direction: column;
    padding: 1px;
    margin: 10px 20px 10px 10px;
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
      font-size: 1rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const HomePage = () => {
  const [traineeDetails, setTraineeDetails] = useState({
    name: "",
    trainingName: "",
    companyName: "",
  });
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const traineeDetailsCookie = Cookies.get("traineeDetails");
    if (traineeDetailsCookie) {
      const parsedDetails = JSON.parse(traineeDetailsCookie);
      setTraineeDetails({
        name: parsedDetails.Name || "",
        trainingName: parsedDetails.TrainingName || "",
        companyName: parsedDetails.CompanyName || "",
      });
    }
    const trainingID = JSON.parse(traineeDetailsCookie)?.TrainingID;
    if (trainingID) {
      axios
        .get(`http://localhost:2000/admin/getMaterial/${trainingID}`)
        .then((response) => {
          if (response.data.status === "success") {
            setMaterials(response.data.materials);
          }
        })
        .catch((error) => {
          console.error("Error fetching materials:", error);
        });
    }
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

  return (
    <Container>
      <UserInfoBox>
        <UserInfo>
          <p>
            <label>Name:</label> {traineeDetails.name}
          </p>
          <p>
            <label>Training Name:</label> {traineeDetails.trainingName}
          </p>
          <p>
            <label>Company Name:</label> {traineeDetails.companyName}
          </p>
        </UserInfo>
      </UserInfoBox>

      <Grid container spacing={4} style={{ marginTop: "40px", textAlign: "center" }}>
        {materials.length > 0 ? (
          materials.map((material, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Title: {material.Title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Description: {material.Description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewFile(material.File)}
                  >
                    View {material.Title}
                  </Button>
                </CardContent>
              </Card>
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
