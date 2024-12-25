import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Grid, Typography } from '@mui/material';
import jsPDF from 'jspdf';

const Container = styled(Box)`
  background-color: #2b6777;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WeekBox = styled(Box)`
  background-color: grey;
  color: white;
  padding: 20px;
  margin: 10px;
  cursor: pointer;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #3b7f87;
  }
`;

const LeaderboardContainer = styled(Box)`
  color: #ffffff;
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
`;

const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 15px;
  background-color: #b0b9da;
  border-radius: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Rank = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: #2b6777;
  width: 60px;
  text-align: center;
`;

const Name = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2b6777;
  flex: 1;
  text-align: left;
`;

const Score = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #2b6777;
  text-align: right;
  width: 80px;
`;

const GeneratePDFButton = styled.button`
  background-color: #3cb371;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 40px;

  &:hover {
    background-color: #2a9d67;
  }
`;

const PDFTitle = styled.div`
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: #2b6777;
  margin-bottom: 30px;
`;

const RankBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #2b6777;
  margin: 10px 0;
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
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(20, verticalOffset + 2, 190, verticalOffset + 2);
  
      verticalOffset += 10; 
    });
    doc.setFontSize(10);
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, 180, doc.internal.pageSize.height - 10);
    doc.save(`leaderboard_week_${weekId}.pdf`);
  };
  

  if (!weekId) {
    return (
      <Container>
        <Typography variant="h4" color="white" gutterBottom>
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
      <Typography variant="h4" color="white" gutterBottom>
        Leaderboard - Week {weekId}
      </Typography>
      <LeaderboardContainer>
        {leaderboardData.map((player) => (
          <LeaderboardItem key={player.rank}>
            <Rank>{player.rank}</Rank>
            <Name>{player.name}</Name>
            <Score>{player.score}</Score>
          </LeaderboardItem>
        ))}
      </LeaderboardContainer>
      <GeneratePDFButton onClick={generatePDF}>Generate PDF</GeneratePDFButton>
    </Container>
  );
};

export default DetailedLeaderboard;
