import React from "react";
import styled, { keyframes } from "styled-components";

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
  background: #f9f9f9;
  background-size: 400% 400%;
  animation: ${backgroundAnimation} 15s ease infinite;
  color: #ffffff;
  text-align: center;
  padding: 30px;
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

// Main Leaderboard Component
const Leaderboard = () => {
  return (
    <LeaderboardContainer>
      <Title>🏆 Leaderboard Podium</Title>
      <PodiumContainer>
        <Podium
          bgColor="linear-gradient(135deg, #d9d9d9, #b0b0b0)"
          textColor="#2b6777"
          height="250px"
        >
          <Medal bgColor="#b0b0b0">🥈</Medal>
          <Name>Ashley</Name>
          <Score>5805 points</Score>
        </Podium>
        <Podium
          bgColor="linear-gradient(135deg, #ffe066, #ffcc00)"
          textColor="#2b6777"
          height="300px"
          isFirst
        >
          <Medal bgColor="#ffcc00">🥇</Medal>
          <Name>Chris</Name>
          <Score>6500 points</Score>
        </Podium>
        <Podium
          bgColor="linear-gradient(135deg, #cd7f32, #a45a29)"
          textColor="#ffffff"
          height="200px"
        >
          <Medal bgColor="#cd7f32">🥉</Medal>
          <Name>Jordan</Name>
          <Score>5200 points</Score>
        </Podium>
      </PodiumContainer>
      <NextButton>Full Leaderboard</NextButton>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
