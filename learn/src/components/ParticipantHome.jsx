import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Cookies from "js-cookie";
// import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";


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

  p {
    margin: 10px;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    p {
      font-size: 1.3rem;
    }
  }
`;

const TrainingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const TrainingBox = styled.div`
  background: linear-gradient(to bottom, #ffffff, #e1eef6);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2b6777;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
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
        //   console.log(parsedDetails);
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
    // Set the cookie with the selected training details
    Cookies.set("traineeDetails", JSON.stringify(training), { expires: 7, secure: true,}); // Cookie expires in 1 day

    // Redirect after a delay
    setTimeout(() => {
      window.location.href = "/Home";
    }, 1500);
  };

  return (
    <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles />
    <Container>
      <UserInfoBox>
        <UserInfo>
          <p>
            <label>Participant's Name:</label> {traineeDetails.name}
          </p>
          <p>
            <label>Company Name:</label> {traineeDetails.companyName}
          </p>
        </UserInfo>
      </UserInfoBox>
      <TrainingsGrid>
        {trainings.map((training, index) => (
          <TrainingBox key={index} onClick={() => handleTrainingClick(training)}>
            {training.TrainingName}
          </TrainingBox>
        ))}
      </TrainingsGrid>
    </Container>
    </ThemeProvider>
  );
};

export default HomePage;
