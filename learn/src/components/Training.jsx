import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Cookies from 'js-cookie'; // Import js-cookie
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

const Container = styled.div`
  padding: 0 40px;
  margin: 0 auto;
  height: auto;
`;

const UserInfoBox = styled.div`
  background: url('/back.png') no-repeat center center;
  background-size: cover;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 20px auto;
  display: flex;
  align-items: center;
  gap: 40px;
  height: 250px;

  @media (max-width: 1000px) {
    background: url('/back1.png');
    gap: 20px;
    height: auto;
    flex-direction: column;
    padding: 15px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  color: #fff;
  h2 {
    margin: 10px;
    font-size: 2rem;
    font-weight: bold;
  }
  p {
    margin: 10px;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 2rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const FeatureBoxesContainer = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three boxes in the first row */
  gap: 40px;
  padding: 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); /* Two per row on smaller screens */
  }

  @media (max-width: 768px) {
    grid-template-columns:  1fr !important; /* Single column layout on smaller screens */
    // margin-top: 40px;
  }

  // & > :nth-child(4) {
  //   grid-column: 2 / span 1; /* Center the first box in the second row */
  // }
`;

const FeatureBox = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height:150px;
  color: #000; /* Pitch black text */
  text-decoration: none; /* No underline for text */
  height: auto;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 50%; /* Full width of the box */
    max-height: 120; /* Adjust to maintain uniformity */
    border-radius: 8px;
    margin-bottom: 10px;
    object-fit: cover; /* Scale and crop to fit */
  }

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #000; /* Pitch black text */
    text-decoration:none;
  }

  p {
    font-size: 1rem;
    color: #000; /* Pitch black text */
    text-decoration:none;
  }

  @media (max-width: 768px) {
    padding: 15px;

    h3 {
      font-size: 1.2rem;
    }
    p {
      font-size: 0.9rem;
    }
    img {
      max-height: 150px;
    }
  }
`;


const HomePage = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls
  const [TrainingName, setTrainingName] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  const [data, setData] = useState({
    material: null,
    trainee: null,
    leaderboard: null,
    submision: null,
    
  });

  useEffect(() => {
    // Simulating API call with hardcoded data
    setData({
      material: {
        title: "Material",
        description: "Explore materials and resources.",
        image: "https://cdn.pixabay.com/photo/2013/07/13/01/18/pdf-155498_640.png",
      },
      trainee: {
        title: "Participant",
        description: "View and manage Participants.",
        image: "https://img.freepik.com/free-vector/seminar-concept-illustration_114360-7855.jpg",
      },
      leaderboard: {
        title: "Leaderboard",
        description: "Check the leaderboard rankings.",
        image: "https://cdn3d.iconscout.com/3d/premium/thumb/leaderboard-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--winner-podium-trophy-seo-pack-business-illustrations-4034317.png",
      },
      submission: {
        title: "Submission",
        description: "Check the Participant submissions.",
        image: "https://img.freepik.com/free-vector/fill-out-concept-illustration_114360-5560.jpg",
      },
      quotation: { 
        title: "Quotations",
        description: "Explore motivational quotes.",
        image: "https://static.vecteezy.com/system/resources/thumbnails/009/458/854/small/quote-icon-logo-design-template-vector.jpg",
      },
      chatbot: { 
        title: "Chatbot",
        description: "Manage and assist trainee inquiries.",
        image: "https://img.freepik.com/free-vector/chat-bot-concept-illustration_114360-30458.jpg?t=st=1737053208~exp=1737056808~hmac=8c17d6453ab0918c97345624d0adc4aef91140129958a1ae6e329e611eaf63d4&w=740",
      },
    });

    // Retrieve the cookie value and log it to the console
    const selectedTraining = Cookies.get('selectedTraining');
    if (selectedTraining) {
      // console.log("Selected Training:", JSON.parse(selectedTraining));
      const selectedTraining1 = JSON.parse(selectedTraining);
      setTrainingName(selectedTraining1.name);
      setCompanyName(selectedTraining1.company);

    } else {
      // console.log("No selected training cookie found.");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles />
    <Container>
      <UserInfoBox>
        <UserInfo>
          <h3>Training Name: {TrainingName}</h3>
          <h3>Company Name: {companyName}</h3>
        </UserInfo>
      </UserInfoBox>
      <FeatureBoxesContainer>
        {Object.keys(data).map((key) => (
          <Link key={key} to={`/${key}`} style={{ textDecoration: "none" }}>
            <FeatureBox>
              <img src={data[key]?.image} alt={data[key]?.title} />
              <h3>{data[key]?.title}</h3>
              <p>{data[key]?.description}</p>
            </FeatureBox>
          </Link>
        ))}
</FeatureBoxesContainer>
    </Container>
    </ThemeProvider>
  );
};

export default HomePage;




