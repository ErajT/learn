import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Box, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Container = styled(Box)`
  background-color: #2b6777;
  min-height: 100vh;
  padding: 20px;
`;

const WeekBox = styled(Box)`
  background-color: grey;
  color: white;
  padding: 20px;
  margin: 10px;
  cursor: pointer;
  &:hover {
    background-color: #3b7f87;
  }
`;

const LeaderboardPage = () => {
  const [weeks, setWeeks] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchWeeks = () => {
      const data = [
        { id: 1, name: 'Jan Week 1' },
        { id: 2, name: 'Jan Week 2' },
        { id: 3, name: 'Jan Week 3' },
        { id: 4, name: 'Jan Week 4' },
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
      <Typography variant="h4" color="white" gutterBottom>
        Leaderboard Weeks
      </Typography>
      <Grid container spacing={2}>
        {weeks.map((week) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={week.id}>
            <WeekBox onClick={() => handleBoxClick(week.id)}>
              <Typography variant="h6">{week.name}</Typography>
            </WeekBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LeaderboardPage;
