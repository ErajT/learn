import React from "react";
import styled, { keyframes } from "styled-components";

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

const podiumHover = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;
const LeaderboardContainer = styled.div`
  background: #2b6777;
  background-size: 400% 400%;
  animation: ${backgroundAnimation} 15s ease infinite;
  color: #ffffff;
  text-align: center;
  padding: 0;
  margin: 0; 
  min-height: 100vh; 
  width: 100vw; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
   color: #b0b9da;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
  margin-bottom: 40px;
  margin-top: 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-top: -50px; 
  }
`;


const PodiumContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  width: 100%;
  max-width: 700px;
  margin-bottom: 40px;
  flex-wrap: nowrap;  

  @media (max-width: 768px) {
    flex-direction: row;  
  }
`;

const Podium = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background: ${(props) => props.bgColor || "#ffffff"};
  color: ${(props) => (props.textColor ? props.textColor : "#2b6777")};
  width: ${(props) => props.width || "100px"};
  height: ${(props) => props.height || "200px"};
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1);
  animation: ${props => (props.isFirst ? pulseEffect : podiumHover)} 3s ease infinite;
  position: relative;
  overflow: hidden;
  padding: 10px;

  &:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    width: ${(props) => props.mobileWidth || "90px"};  
    height: ${(props) => props.mobileHeight || "160px"};  
  }
`;

const Medal = styled.div`
  position: absolute;
  top: 10px;
  background: linear-gradient(135deg, ${(props) => props.bgColor}, #ffffff);
  color: #ffffff;
  font-size: 2rem;
  font-weight: bold;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  background-size: 200%;
  animation: ${shineEffect} 2s ease infinite;
`;

const Name = styled.div`
  font-weight: 700;
  margin: 10px 0;
  font-size: 1.4rem;
  color: ${(props) => props.textColor || "#ffffff"};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Score = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.textColor || "#ffffff"};
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const NextButton = styled.button`
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);

  &:hover {
    background: linear-gradient(135deg, #feb47b, #ff7e5f);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Leaderboard = () => {
  return (
    <LeaderboardContainer>
      <Title>🏆 Leaderboard Podium</Title>
      <PodiumContainer>
        <Podium
          bgColor="linear-gradient(135deg, #d9d9d9, #b0b0b0)"
          textColor="#2b6777"
          height="180px"
          mobileHeight="140px"
        >
          <Medal bgColor="#b0b0b0">🥈</Medal>
          <Name>Ashley</Name>
          <Score>5805 points</Score>
        </Podium>
        <Podium
          bgColor="linear-gradient(135deg, #ffe066, #ffcc00)"
          textColor="#2b6777"
          height="220px"
          mobileHeight="160px"
          isFirst
        >
          <Medal bgColor="#ffd700">🥇</Medal>
          <Name>Lucy</Name>
          <Score>5930 points</Score>
        </Podium>
        <Podium
          bgColor="linear-gradient(135deg, #e4a370, #cd7f32)"
          textColor="#ffffff"
          height="150px"
          mobileHeight="120px"
        >
          <Medal bgColor="#cd7f32">🥉</Medal>
          <Name>Daniel</Name>
          <Score>4932 points</Score>
        </Podium>
      </PodiumContainer>
      <NextButton>View More Stats</NextButton>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
