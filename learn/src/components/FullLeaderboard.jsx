import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Cookies from "js-cookie"; // Add js-cookie for cookie handling

// Styled Components
const LeaderboardContainer = styled.div`
  background-color: #ffffff;
  color: #ffffff;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 100px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding-top: 100px; 
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #2b6777;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align:center;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
    display: flex;
    flex-direction: row;
    left: 50%;
    justify-content: center;
    align-items: center;
  }
`;

const LeaderboardItem = styled.div`
  width: 90%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #2b6777;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const Rank = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  width: 50px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Name = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProgressContainer = styled.div`
  flex: 2;
  background-color: #e5e7eb;
  border-radius: 8px;
  height: 12px;
  position: relative;
  overflow: hidden;
  margin: 0 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  border-radius: 8px;
  background-color: ${({ type }) => (type === "positive" ? "#3CB371" : "#FF6347")};
  width: ${({ percentage }) => `${percentage}%`};
  transition: width 0.5s ease-in-out;
`;

const Score = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-align: right;
  width: 60px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

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

const FullLeaderboard = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const traineeDetailsCookie = Cookies.get("traineeDetails"); // Get the trainingID from cookies
    const trainingID = JSON.parse(traineeDetailsCookie)?.TrainingID;
    console.log(trainingID);

    if (!trainingID) {
      setMessage("Training ID not found in cookies.");
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/leaderboard/getFullLeaderboard/${trainingID}`
        );

        if (response.data.status === "success") {
          if (response.data.message === "All trainees fetched successfully.") {
            setLeaderboardData(response.data.allTrainees || []);
          } else {
            setMessage(response.data.message || "Failed to fetch leaderboard.");
          }
        } else {
          setMessage(response.data.message || "Failed to fetch leaderboard.");
        }
      } catch (error) {
        setMessage(error.message || "An error occurred while fetching the leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <LeaderboardContainer>Loading...</LeaderboardContainer>;
  }

  // Maximum score for the progress bar (385)
  const MAX_SCORE = 385;

  return (
    <LeaderboardContainer>
      <Title>Consolidated Leaderboard</Title>
      {message ? (
        <Message>{message}</Message>
      ) : (
        leaderboardData.map((player, index) => (
          <LeaderboardItem key={index}>
            <Rank>{index + 1}</Rank>
            <Name>{player.Name}</Name>
            <ProgressContainer>
              {/* Calculate the percentage for the positive progress bar */}
              <ProgressBar type="positive" percentage={(player.Score / MAX_SCORE) * 100} />
              <ProgressBar type="negative" percentage={100 - (player.Score / MAX_SCORE) * 100} />
            </ProgressContainer>
            <Score>{player.Score}</Score>
          </LeaderboardItem>
        ))
      )}
    </LeaderboardContainer>
  );
};

export default FullLeaderboard;
