import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie to get cookies
import axios from "axios"; // Import axios for making API calls
import { jsPDF } from "jspdf"; // Import jsPDF for PDF generation
// import styled from "styled-components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Anaheim, Arial, sans-serif",
  },
});

// Inject @font-face rule
const GlobalStyles = styled("style")(() => ({
  "@font-face": {
    fontFamily: "Anaheim",
    src: "url('/Anaheim.ttf') format('truetype')",
  },
}));


const Container = styled(Box)`
  // background: linear-gradient(135deg, #f3f4f6, #e9ecef);
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

  @media (max-width: 1200px) {
    font-size: 2.5rem;
    margin-bottom: 25px;
  }

  @media (max-width: 1024px) {
    font-size: 2rem;
    margin-bottom: 20px;
    padding-top: 25px;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 15px;
    padding-top: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 10px;
    padding-top: 15px;
  }
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
const Footer = styled("footer")(() => ({
  // backgroundColor: "#2b6777",
  color: "#2b6777",
  padding: "20px 0",
  textAlign: "center",
  position: "sticky", // Makes the footer sticky at the bottom of the viewport
  bottom: 0,
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const Logo = styled("img")(() => ({
  height: "40px",
  margin: "0 10px",
}));


const LeaderboardPage = () => {
  const backendUrl = "https://64f9-116-90-103-244.ngrok-free.app";  // Use this in API calls
  const [weeks, setWeeks] = useState([]);
  const [leaderboards, setLeaderboards] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const traineeDetailsCookie = Cookies.get("selectedTraining");
    const trainingID = JSON.parse(traineeDetailsCookie)?.trainingID;

    if (!trainingID) {
      console.error("Training ID not found in cookies");
      return;
    }

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

  const generatePDF = async () => {
    await fetchLeaderboards();
  
    const doc = new jsPDF();
  
    doc.setFontSize(22);
    doc.text("Leaderboard Data", 80, 20);
  
    if (leaderboards && leaderboards.length > 0) {
      let yOffset = 30;
      leaderboards.forEach((leaderboard, leaderboardIndex) => {
        const boxX = 20;
        const boxY = yOffset;
        const boxWidth = 170;
        const boxHeight = 10 + leaderboard.leaderboardDetails.length * 8 + 25; 
  
        doc.setDrawColor(0); 
        doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 10, 10, 'D'); 
        doc.setFontSize(17);
        doc.setTextColor(0, 0, 0);
        doc.text(`Week ${leaderboard.WeekNumber} `, boxX + 10, boxY + 15);
        doc.text(`(${leaderboard.WeekDates})`, boxX + 32, boxY +15);

        let rowYOffset = boxY + 25; 
        leaderboard.leaderboardDetails.forEach((detail, idx) => {
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`${idx + 1}. ${detail.Name}: ${detail.Score}`, boxX + 10, rowYOffset);
          rowYOffset += 8; 
          if (rowYOffset > 270) {
            doc.addPage();
            rowYOffset = 20; 
          }
        });
        yOffset = rowYOffset + 10; 
        if (leaderboardIndex < leaderboards.length - 1) {
          yOffset += 20; 
        }
      });
    } else {
      doc.setFontSize(12);
      doc.text("No leaderboard data available.", 20, yOffset);
    }
    doc.save("leaderboards.pdf");
  };
  
  return (
    <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles />
    
    <Container>
      {/* <Title variant="h2">Leaderboard Weeks</Title> */}
      <Typography 
  variant="h3" 
  color="#2b6777" 
  gutterBottom 
  sx={{ 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop:'30px', 
    fontSize: { xs: '2.4rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }
  }}
>
  Leaderboard Weeks
</Typography>

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
                  fontSize: "1.3rem",
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
        style={{ marginTop: "20px", marginBottom: "20px",background:"#2b6777",font:'1.3rem'}}
      >
        Generate PDF
      </Button>
    </Container>
    {/* <Footer>
      <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Logo src="/form.png" alt="Logo 1" />
        <Typography variant="body2">
          © 2024 Your Company. All rights reserved.
        </Typography>
        <Logo src="/lap.png" alt="Logo 2" />
      </Box>
    </Footer> */}
    </ThemeProvider>
  );
};

export default LeaderboardPage;
