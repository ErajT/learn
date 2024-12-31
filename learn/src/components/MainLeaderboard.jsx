import React, {useEffect, useState} from "react";
import styled, { keyframes } from "styled-components";
import Cookies from "js-cookie";
import axios from "axios";
import { Link } from 'react-router-dom';
// Animations

const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineEffect = keyframes`
  0% { background-position: -150%; }
  100% { background-position: 150%; }
`;

const pulseEffect = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 215, 0, 1); }
  100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
`;

// Main Container
const LeaderboardContainer = styled.div`
  // background: #f9f9f9;
  background-size: 400% 400%;
  animation: ${backgroundAnimation} 15s ease infinite;
  color: #ffffff;
  text-align: center;
  // padding: 30px;
  padding: 0 30px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

// Title
const Title = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  color: #2b6777;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
  margin-bottom: 40px;
  transition: margin 0.3s ease;

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 80px;
    margin-top: -50px; /* Move upwards on small screens */
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-top: -80px;
  }
`;

// Podium Container
const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

// Individual Podium
const Podium = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: ${(props) => props.bgColor || "#ffffff"};
  color: ${(props) => (props.textColor ? props.textColor : "#2b6777")};
  width: ${(props) => props.width || "150px"};
  height: ${(props) => props.height || "300px"};
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  padding: 10px;

  @media (max-width: 1024px) {
    width: ${(props) => props.tabletWidth || "120px"};
    height: ${(props) => props.tabletHeight || "250px"};
  }

  @media (max-width: 768px) {
    width: ${(props) => props.mobileWidth || "100px"};
    height: ${(props) => props.mobileHeight || "200px"};
  }

  @media (max-width: 480px) {
    width: ${(props) => props.smallWidth || "80px"};
    height: ${(props) => props.smallHeight || "160px"};
  }
`;

// Medal
const Medal = styled.div`
  position: absolute;
  top: 10px;
  background: linear-gradient(135deg, ${(props) => props.bgColor}, #ffffff);
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: bold;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  background-size: 200%;
  animation: ${shineEffect} 2s ease infinite;

  @media (max-width: 1024px) {
    font-size: 2rem;
    width: 70px;
    height: 70px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    width: 50px;
    height: 50px;
  }
`;

// Name
const Name = styled.div`
  font-weight: 700;
  margin: 10px 0;
  font-size: 1.6rem;
  color: ${(props) => props.textColor || "#ffffff"};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Score
const Score = styled.div`
  font-size: 1.4rem;
  color: ${(props) => props.textColor || "#ffffff"};
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

// Button
const NextButton = styled.button`
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
  margin-top: 30px;

  &:hover {
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 12px 30px;
    margin-top: 80px; /* Adjusted for small screens */
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 10px 20px;
    margin-top: 60px;
  }
`;

// Styled components
const Message = styled.div`
  font-size: 1.5rem;
  color: #555;
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Snackbar component
const Snackbar = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336; /* Red for error */
  color: white;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-size: 1rem;
  animation: fadeIn 0.3s ease, fadeOut 0.3s ease 3s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;


// Main Leaderboard Component
const Leaderboard = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls

  const [topThree, setTopThree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const traineeDetailsCookie = Cookies.get("traineeDetails"); // Get TrainingID from cookies
      try {
        const traineeDetails = traineeDetailsCookie
          ? JSON.parse(traineeDetailsCookie)
          : null;
        const trainingID = traineeDetails?.TrainingID;

        if (!trainingID) {
          setMessage("Training ID not found in cookies.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${backendUrl}/leaderboard/getTopThree/${trainingID}`
        );
        if (response.data.status === "success") {
          if (response.data.topThree?.length > 0) {
            setTopThree(response.data.topThree);
          } else {
            setMessage("No leaderboard found for your training.");
          }
        } else {
          const errorMessage = response.data.message || "Failed to fetch leaderboard.";
          if (errorMessage === "No leaderboard found for the given training.") {
            setMessage(errorMessage);
          } else {
            setSnackbarMessage(errorMessage);
          }
        }
      } catch (err) {
        const errorMessage = err.message || "An error occurred while fetching leaderboard.";
        setSnackbarMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarMessage(null);
  };

  if (loading) {
    return <LeaderboardContainer>Loading...</LeaderboardContainer>;
  }

  return (
    <LeaderboardContainer>
      <Title>🏆 Leaderboard Podium</Title>
      {message === "No leaderboard found for the given training." ? (
        <Message>{message}</Message>
      ) : (
        <>
          <PodiumContainer>
            {topThree.map((trainee, index) => {
              const podiumStyles = [
                {
                  order: 1, // Position 2 to the left
                  bgColor: "linear-gradient(135deg, #d9d9d9, #b0b0b0)",
                  height: "250px",
                  tabletHeight: "200px",
                  mobileHeight: "150px",
                  smallHeight: "120px",
                  medal: "🥈",
                  medalColor: "#b0b0b0",
                },
                {
                  order: 2, // Position 1 in the center
                  bgColor: "linear-gradient(135deg, #ffe066, #ffcc00)",
                  height: "300px",
                  tabletHeight: "250px",
                  mobileHeight: "200px",
                  smallHeight: "150px",
                  medal: "🥇",
                  medalColor: "#ffcc00",
                },
                {
                  order: 3, // Position 3 to the right
                  bgColor: "linear-gradient(135deg, #cd7f32, #a45a29)",
                  height: "200px",
                  tabletHeight: "175px",
                  mobileHeight: "125px",
                  smallHeight: "100px",
                  medal: "🥉",
                  medalColor: "#cd7f32",
                },
              ];
              

              const { order, bgColor, height, medal, medalColor, tabletHeight, mobileHeight, smallHeight } = podiumStyles[index];
              return (
                <Podium
                  key={index}
                  bgColor={bgColor}
                  height={height}
                  tabletHeight={tabletHeight}
                  smallHeight={smallHeight}
                  mobileHeight={mobileHeight}
                  style={{ order }}
                >
                  <Medal bgColor={medalColor}>{medal}</Medal>
                  <Name>{trainee.Name}</Name>
                  <Score>{trainee.Score} points</Score>
                </Podium>
              );
            })}
          </PodiumContainer>;
          <NextButton>
  <Link to="/fullLeaderboard" style={{ textDecoration: 'none', color: 'inherit' }}>
    Full Leaderboard
  </Link>
</NextButton>
        </>
      )}
      {snackbarMessage && (
        <Snackbar onClick={handleSnackbarClose}>
          {snackbarMessage}
        </Snackbar>
      )}
    </LeaderboardContainer>
  );
};

export default Leaderboard;