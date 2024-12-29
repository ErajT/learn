import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie to get cookies
import axios from "axios"; // Import axios for making API calls
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation

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
  const [leaderboards, setLeaderboards] = useState(null); // State for leaderboards data
  const navigate = useNavigate();

  useEffect(() => {
    // Get the TrainingID from the cookie
    const traineeDetailsCookie = Cookies.get("selectedTraining");
    const trainingID = JSON.parse(traineeDetailsCookie)?.trainingID;

    if (!trainingID) {
      console.error("Training ID not found in cookies");
      return;
    }

    // Fetch weeks for the given TrainingID
    const fetchWeeks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/admin/getweeks/${trainingID}`
        );

        if (response.data.status === "success") {
          setWeeks(response.data.weeks || []);
        } else {
          console.error("Failed to fetch weeks:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching weeks:", error.message);
      }
    };

    fetchWeeks();
  }, []);

  const handleBoxClick = (weekId) => {
    navigate(`/leaderboard/${weekId}`);
  };

  // Function to fetch leaderboards data
  const fetchLeaderboards = async () => {
    try {
      const traineeDetailsCookie = Cookies.get("selectedTraining");
      const trainingID = JSON.parse(traineeDetailsCookie)?.trainingID;

      if (!trainingID) {
        console.error("Training ID not found in cookies");
        return;
      }

      const response = await axios.get(
        `http://localhost:2000/admin/getAllLeaderboards/${trainingID}`
      );

      if (response.data.status === "success") {
        setLeaderboards(response.data.allLeaderboards);
      } else {
        console.error("Failed to fetch leaderboards:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching leaderboards:", error.message);
    }
  };

  // Function to generate PDF when clicked
  const generatePDF = async () => {
    // Fetch leaderboards when generating PDF
    await fetchLeaderboards();

    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Leaderboard Data", 20, 20);
  
    if (leaderboards && leaderboards.length > 0) {
      let yOffset = 30; // Start offset for the first piece of data
  
      leaderboards.forEach((leaderboard) => {
        // Add leaderboard title and week information
        doc.setFontSize(14);
        doc.text(`Week ${leaderboard.WeekNumber} (${leaderboard.WeekDates})`, 20, yOffset);
        yOffset += 10;
  
        // Loop through the leaderboard details
        leaderboard.leaderboardDetails.forEach((detail, idx) => {
          doc.setFontSize(12);
          doc.text(`${idx + 1}. ${detail.Name}: ${detail.Score}`, 20, yOffset);
          yOffset += 8;
  
          // Ensure we don't overflow the page
          if (yOffset > 270) {
            doc.addPage();
            yOffset = 20;
          }
        });
  
        // Add extra space between leaderboards
        yOffset += 10;
      });
    } else {
      doc.setFontSize(12);
      doc.text("No leaderboard data available.", 20, yOffset);
    }
  
    // Save the generated PDF
    doc.save("leaderboards.pdf");
  };

  return (
    <Container>
      <Title variant="h4">Leaderboard Weeks</Title>
      <Divider />
      <Grid container spacing={3} justifyContent="center">
        {weeks.map((week) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={week}>
            <WeekBox onClick={() => handleBoxClick(week)}>
              <Typography
                variant="h6"
                align="center"
                style={{
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  fontSize: "1.2rem",
                }}
              >
                {`Week ${week}`}
              </Typography>
            </WeekBox>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        onClick={generatePDF}
        style={{ marginTop: "20px", marginBottom: "20px",background:"#2b6777",font:'1rem'}}
      >
        Generate PDF
      </Button>
    </Container>
  );
};

export default LeaderboardPage;
