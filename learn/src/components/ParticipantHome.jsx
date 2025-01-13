import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Anaheim, Arial, sans-serif",
  },
});

const Container = styled.div`
  padding: 0;
  margin: 0 auto;
`;

const UserInfoBanner = styled.div`
  background: url('/back.png') no-repeat center center;
  background-size: cover;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90vw;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 40px;
  height: 250px;

  @media (max-width: 1000px) {
    background: url('/back1.png') no-repeat center center;
    background-size: cover;
    flex-direction: column;
    width: 85vw;
    padding: 20px;
    height: auto; /* Adjust height dynamically */
  }

  @media (max-width: 768px) {
    gap: 20px; /* Reduce gap for smaller screens */
    width: 75vw;
    padding: 15px;
  }
`;

const TrainingsGrid = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allows wrapping to a new row when space is unavailable */
  gap: 20px; /* Spacing between boxes */
  margin-top: 10px;
  padding-left: 10px;
  justify-content: flex-start; /* Align boxes to the left */
`;

const TrainingBox = styled.div`
  background: linear-gradient(to bottom, #ffffff, #e1eef6);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2b6777;
  height: 200px;
  width: 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    height: 220px;
    width: 220px;
    font-size: 1.2rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  color: #fff;
  padding: 20px;

  p {
    margin: 0;
    font-size: 1.8rem;
    font-weight: bold;

    label {
      font-weight: normal;
      color: #ddd;
    }
  }

  @media (max-width: 768px) {
    p {
      font-size: 1.2rem;
    }
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
`;
const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2b6777;
  // margin-bottom: 5px;
  text-align: center; /* Centers the title horizontally */
  width: 100%; /* Ensures the title takes up full width */

  @media (max-width: 768px) {
    font-size: 2rem; /* Reduces font size on smaller screens */
  }

  @media (max-width: 480px) {
    font-size: 1.5rem; /* Further reduce font size on very small screens */
  }
`;


const HomePage = () => {
  const [trainings, setTrainings] = useState([]);
  const [traineeDetails, setTraineeDetails] = useState({
    name: "",
    companyName: "",
  });

  useEffect(() => {
    const fetchTraineeDetails = () => {
      const traineeDetailsCookie = Cookies.get("traineeDetails1");
      if (traineeDetailsCookie) {
        const parsedDetails = JSON.parse(traineeDetailsCookie);
        if (Array.isArray(parsedDetails) && parsedDetails.length > 0) {
          setTrainings(parsedDetails);
          const firstElement = parsedDetails[0];
          setTraineeDetails({
            name: firstElement.Name || "",
            companyName: firstElement.CompanyName || "",
          });
        }
      }
    };

    fetchTraineeDetails();
  }, []);

  const handleTrainingClick = (training) => {
    Cookies.set("traineeDetails", JSON.stringify(training), {
      expires: 7,
      secure: true,
    });

    setTimeout(() => {
      window.location.href = "/Home";
    }, 1500);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <UserInfoBanner>
          <UserInfo>
            <p>
              <label>Participant's Name:</label> {traineeDetails.name}
            </p>
            <p>
              <label>Company Name:</label> {traineeDetails.companyName}
            </p>
          </UserInfo>
        </UserInfoBanner>

        <PageWrapper>
          <Title>Choose Training</Title> {/* Title at the top of the grid */}
          <TrainingsGrid>
            {trainings.map((training, index) => (
              <TrainingBox key={index} onClick={() => handleTrainingClick(training)}>
                <div>{training.TrainingName}</div>
              </TrainingBox>
            ))}
          </TrainingsGrid>
        </PageWrapper>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
