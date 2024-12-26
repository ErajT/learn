import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Container = styled(Box)`
  background: linear-gradient(135deg, #f3f4f6, #e9ecef);
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(Typography)`
  color: #2b6777; 
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 3px solid #2b6777; 
  padding-bottom: 10px;
  padding-top: 30px;
`;

const WeekBox = styled(Box)`
  background: linear-gradient(135deg, #2b6777, #4a89a1); 
  color: white;
  padding: 25px;
  margin: 20px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s, box-shadow 0.4s;
  &:hover {
    transform: translateY(-5px) scale(1.05); 
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  }
`;

const Divider = styled(Box)`
  height: 3px;
  width: 50px;
  background-color: #2b6777;
  margin: 20px 0;
`;

const LeaderboardPage = () => {
  const [weeks, setWeeks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeeks = () => {
      const data = [
        { id: 1, name: "Week 1" },
        { id: 2, name: "Week 2" },
        { id: 3, name: "Week 3" },
        { id: 4, name: "Week 4" },
      ];
      setWeeks(data);
    };
    fetchWeeks();
  }, []);

  const handleBoxClick = (weekId) => {
    navigate(`/leaderboard/${weekId}`);
  };

  return (
    <Container>
      <Title variant="h4">Leaderboard Weeks</Title>
      <Divider />
      <Grid container spacing={3} justifyContent="center">
        {weeks.map((week) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={week.id}>
            <WeekBox onClick={() => handleBoxClick(week.id)}>
              <Typography
                variant="h6"
                align="center"
                style={{
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  fontSize: "1.2rem",
                }}
              >
                {week.name}
              </Typography>
            </WeekBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LeaderboardPage;
