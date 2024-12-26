import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 40px; 
  margin: 0 auto;
//   max-width: 1200px; 
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
    gap: 20px; /* Reduce the gap between the user info and image */
    height: auto; /* Allow the height to adjust for smaller screens */
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
      font-size: 1.5rem; /* Adjust font size for small screens */
    }
    p {
      font-size: 1rem; /* Adjust font size for small screens */
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
    grid-template-columns: repeat(2, 1fr); /* Two columns for medium screens */
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column for small screens */
    margin-top: 40px; /* Reduce top margin for small screens */
  }
`;

const FeatureBox = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
  h3 {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  p {
    font-size: 0.9rem;
    color: #777;
  }

  @media (max-width: 768px) {
    padding: 15px; /* Adjust padding for small screens */
    h3 {
      font-size: 1rem; /* Adjust font size for small screens */
    }
    p {
      font-size: 0.8rem; /* Adjust font size for small screens */
    }
  }
`;

const HomePage = () => (
  <Container>
    <UserInfoBox>
      <UserInfo>
        <h2>John Doe</h2>
        <p>Software Engineer</p>
        <p>john.doe@example.com</p>
      </UserInfo>
    </UserInfoBox>
    <FeatureBoxesContainer>
      <FeatureBox>
        <h3>Feature 1</h3>
        <p>Detailed description of feature 1 goes here.</p>
      </FeatureBox>
      <FeatureBox>
        <h3>Feature 2</h3>
        <p>Detailed description of feature 2 goes here.</p>
      </FeatureBox>
      <FeatureBox>
        <h3>Feature 3</h3>
        <p>Detailed description of feature 3 goes here.</p>
      </FeatureBox>
    </FeatureBoxesContainer>
  </Container>
);

export default HomePage;