import React from "react";
import styled from "styled-components";

const LeaderboardContainer = styled.div`
  background-color: #2b6777;
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
  color: #b0b9da;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
  margin-bottom: 50px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
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
  background-color: #b0b9da;
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
  color: #2b6777;
  width: 50px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Name = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2b6777;
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
  color: #2b6777;
  text-align: right;
  width: 60px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FullLeaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "ABCD", emoji: "", score: 6960, positive: 70 },
    { rank: 2, name: "Da", emoji: "", score: 5243, positive: 60 },
    { rank: 3, name: "Captain", emoji: "", score: 4940, positive: 50 },
    { rank: 4, name: "Fl", emoji: "", score: 4707, positive: 55 },
    { rank: 5, name: "Ka", emoji: "", score: 3831, positive: 40 },
    { rank: 6, name: "Sh", emoji: "", score: 2804, positive: 30 },
  ];

  return (
    <LeaderboardContainer>
      <Title>Full Leaderboard</Title>
      {leaderboardData.map((player) => (
        <LeaderboardItem key={player.rank}>
          <Rank>{player.rank}</Rank>
          <Name>
            {player.name} {player.emoji}
          </Name>
          <ProgressContainer>
            <ProgressBar type="positive" percentage={player.positive} />
            <ProgressBar type="negative" percentage={100 - player.positive} />
          </ProgressContainer>
          <Score>{player.score}</Score>
        </LeaderboardItem>
      ))}
    </LeaderboardContainer>
  );
};

export default FullLeaderboard;

