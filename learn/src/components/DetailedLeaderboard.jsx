import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Typography, Button } from '@mui/material';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download'; 
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

const Container = styled(Box)`
  // background-color: #f5f5f5;
  min-height: 100vh;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  const backendUrl = "http://localhost:2000";  // Use this in API calls

  const { weekId } = useParams(); // Get the weekId from URL parameters
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const trainingdetailscookie = Cookies.get('selectedTraining'); // Get the training ID from cookies
    const trainingId = JSON.parse(trainingdetailscookie)?.trainingID;
    // console.log(trainingId);
    // console.log(weekId);
    if (!trainingId) {
      console.error('Training ID not found in cookies');
      return;
    }

    if (weekId) {
      // Fetch leaderboard data from the API using weekId and trainingId
      const fetchLeaderboardData = async () => {
        try {
          const response = await fetch(`${backendUrl}/admin/getFullLeaderboard/${trainingId}/${weekId}`);
          if (response.ok) {
            const data = await response.json();
            // console.log(data);
            const updatedLeaderboardData = data.allTrainees.map((player, index) => ({
              ...player,
              rank: index + 1, // Dynamically assign the rank based on index
            }));
            setLeaderboardData(updatedLeaderboardData);
          } else {
            console.error('Error fetching leaderboard data');
          }
        } catch (error) {
          console.error('Error fetching leaderboard data:', error);
        }
      };

      fetchLeaderboardData();
    }
  }, [weekId]);

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
    leaderboardData.forEach((player) => {
      doc.text(`${player.rank}`, 20, verticalOffset);
      doc.text(player.Name, 60, verticalOffset);
      doc.text(player.Score.toString(), 160, verticalOffset);
      doc.line(20, verticalOffset + 2, 190, verticalOffset + 2);
      verticalOffset += 10;
    });
    doc.save(`leaderboard_week_${weekId}.pdf`);
  };

  return (
    <Container>
      {/* <Typography variant="h3" color="#2b6777" gutterBottom>
        Leaderboard - Week {weekId}
      </Typography> */}
<Typography 
  variant="h3" 
  color="#2b6777" 
  gutterBottom 
  sx={{ 
    fontWeight: 'bold', 
    textAlign: 'center',
    marginTop:'20px', 
    fontSize: { xs: '2.4rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }
  }}
>
  Leaderboard - Week {weekId}
</Typography>

      <LeaderboardContainer>
        {leaderboardData.length > 0 ? (
          leaderboardData.map((player) => (
            <LeaderboardItem key={player.rank}>
              <Rank>
                {player.rank}
              </Rank>
              <Name>{player.Name}</Name>
              <Score>{player.Score}</Score>
            </LeaderboardItem>
          ))
        ) : (
          <Typography variant="h6" color="gray">Loading leaderboard...</Typography>
        )}
      </LeaderboardContainer>
      <GeneratePDFButton onClick={generatePDF} startIcon={<DownloadIcon />}>
        Generate PDF
      </GeneratePDFButton>
    </Container>
  );
};

export default DetailedLeaderboard;
