import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Cookies from 'js-cookie'; // Import js-cookie

const Container = styled.div`
  padding: 0 40px;
  margin: 0 auto;
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

  @media (max-width: 768px) {
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
      font-size: 1.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const FeatureBoxesContainer = styled.div`
  margin-top: 80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 40px;
  }
`;

const FeatureBox = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  background-image: ${({ image }) => `url(${image})`};
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    height: 250px;
    padding: 15px;
    h3 {
      font-size: 1.2rem;
    }
    p {
      font-size: 0.9rem;
    }
  }
`;

const HomePage = () => {
  const [data, setData] = useState({
    material: null,
    trainee: null,
    leaderboard: null,
  });

  useEffect(() => {
    // Simulating API call with hardcoded data
    setData({
      material: {
        title: "Material",
        description: "Explore materials and resources.",
        image: "https://img.freepik.com/free-photo/daily-life-business-people-office_53876-47111.jpg",
      },
      trainee: {
        title: "Trainee",
        description: "View and manage trainees.",
        image: "https://img.freepik.com/free-photo/teacher-smart-instructor-grey-suit-classroom-with-computer-whiteboard-holding-notes_140725-163389.jpg?t=st=1734982721~exp=1734986321~hmac=0ed247c91deb73a55d73d744f37819b27f4bd9a4dac36358df7a382c195424fe&w=740",
      },
      leaderboard: {
        title: "Leaderboard",
        description: "Check the leaderboard rankings.",
        image: "https://img.freepik.com/free-photo/african-man-black-suit_1157-45560.jpg?t=st=1734983083~exp=1734986683~hmac=53d0da30c9949e740c0ef138c6c6c1dbfe5cecb533e05407d327b30fca820438&w=740",
      },
    });

    // Retrieve the cookie value and log it to the console
    const selectedTraining = Cookies.get('selectedTraining');
    if (selectedTraining) {
      console.log("Selected Training:", JSON.parse(selectedTraining));
    } else {
      console.log("No selected training cookie found.");
    }
  }, []);

  return (
    <Container>
      <UserInfoBox>
        <UserInfo>
          <h2>John Doe</h2>
          <p>Software Engineer</p>
          <p>john.doe@example.com</p>
        </UserInfo>
      </UserInfoBox>
      <FeatureBoxesContainer>
        {Object.keys(data).map((key) => (
          <Link key={key} to={`/${key}`}>
            <FeatureBox image={data[key]?.image}>
              <h3>{data[key]?.title}</h3>
              <p>{data[key]?.description}</p>
            </FeatureBox>
          </Link>
        ))}
      </FeatureBoxesContainer>
    </Container>
  );
};

export default HomePage;
