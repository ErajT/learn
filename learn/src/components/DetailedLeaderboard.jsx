import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Grid, Typography, Button } from '@mui/material';
import jsPDF from 'jspdf';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; 
import DownloadIcon from '@mui/icons-material/Download'; 

const Container = styled(Box)`
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WeekBox = styled(Box)`
  background-color: #ffffff;
  color: #2b6777;
  padding: 20px;
  margin: 10px;
  cursor: pointer;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background-color: #e8f0f2;
  }
`;

const LeaderboardContainer = styled(Box)`
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
`;

const LeaderboardItem = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #2b6777;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  font-weight: bold;
  color: #ffffff;
  width: 60px;
  text-align: center;

  svg {
    margin-right: 5px;
  }
`;

const Name = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  text-align: left;
`;

const Score = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffffff;
  text-align: right;
  width: 80px;
`;

const GeneratePDFButton = styled(Button)`
  background-color: #2b6777 !important;
  color: white !important;
  border-radius: 5px !important;
  padding: 12px 25px !important;
  font-size: 1rem !important;
  margin-top: 40px !important;

  &:hover {
    background-color: #235e66 !important;
  }
`;

const DetailedLeaderboard = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

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
    const fetchLeaderboardData = (id) => {
      const allData = {
        1: [
          { rank: 1, name: 'Player A', score: 5000 },
          { rank: 2, name: 'Player B', score: 4500 },
          { rank: 3, name: 'Player C', score: 4000 },
        ],
        2: [
          { rank: 1, name: 'Player X', score: 5200 },
          { rank: 2, name: 'Player Y', score: 4800 },
          { rank: 3, name: 'Player Z', score: 4600 },
        ],
        3: [
          { rank: 1, name: 'Player L', score: 5300 },
          { rank: 2, name: 'Player M', score: 4900 },
          { rank: 3, name: 'Player N', score: 4700 },
        ],
        4: [
          { rank: 1, name: 'Player Q', score: 5400 },
          { rank: 2, name: 'Player R', score: 5000 },
          { rank: 3, name: 'Player S', score: 4800 },
        ],
      };
      return allData[id] || [];
    };

    fetchWeeks();

    if (weekId) {
      const data = fetchLeaderboardData(weekId);
      setLeaderboardData(data);
    }
  }, [weekId]);

  const handleWeekClick = (id) => {
    navigate(`/leaderboard/${id}`);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(`Leaderboard for Week ${weekId}`, 20, 30);
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(20, 33, 190, 33);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Rank', 20, 40);
    doc.text('Name', 60, 40);
    doc.text('Score', 160, 40);
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 43, 190, 43);
    let verticalOffset = 50;
    leaderboardData.forEach((player, index) => {
      doc.text(`${player.rank}`, 20, verticalOffset);
      doc.text(player.name, 60, verticalOffset);
      doc.text(player.score.toString(), 160, verticalOffset);
      doc.line(20, verticalOffset + 2, 190, verticalOffset + 2);
      verticalOffset += 10;
    });
    doc.save(`leaderboard_week_${weekId}.pdf`);
  };

  if (!weekId) {
    return (
      <Container>
        <Typography variant="h3" color="#2b6777" gutterBottom>
          Leaderboard Weeks
        </Typography>
        <Grid container spacing={2}>
          {weeks.map((week) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={week.id}>
              <WeekBox onClick={() => handleWeekClick(week.id)}>
                <Typography variant="h6">{week.name}</Typography>
              </WeekBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" color="#2b6777" gutterBottom>
        Leaderboard - Week {weekId}
      </Typography>
      <LeaderboardContainer>
        {leaderboardData.map((player) => (
          <LeaderboardItem key={player.rank}>
            <Rank>
              {player.rank}
            </Rank>
            <Name>{player.name}</Name>
            <Score>{player.score}</Score>
          </LeaderboardItem>
        ))}
      </LeaderboardContainer>
      <GeneratePDFButton onClick={generatePDF} startIcon={<DownloadIcon />}>
        Generate PDF
      </GeneratePDFButton>
    </Container>
  );
};

export default DetailedLeaderboard;
