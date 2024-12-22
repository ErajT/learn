import React from "react";
import { Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { FaHome, FaTrophy, FaChartBar, FaWpforms, FaSignOutAlt } from "react-icons/fa";
import MainLeaderboard from "./components/MainLeaderboard";
import FullLeaderboard from "./components/FullLeaderboard";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    overflow: hidden;
  }
`;
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #ecf0f1;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ isHome }) => (isHome ? "#2b6777" : "#2b6777")};
  color: #ecf0f1;
  width: 80px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  justify-content: center; 
  align-items: center;
  padding: 20px 0;
  transition: background-color 0.3s ease-in-out;
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px; 
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1.5rem;
  transition: color 0.2s, transform 0.2s;
  width: 100%;
  gap: 10px; 
  margin-bottom: 20px; 

  &.active {
    color: #1abc9c;
  }

  &:hover {
    color: #1abc9c;
    transform: scale(1.1);
  }
`;

const LogoutButton = styled.button`
  color: #fff;
  background-color: transparent; 
  border: none;
  padding: 15px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  position: absolute;
  bottom: 20px; 
  width: 100%; 
  text-align: center;

  &:hover {
    transform: scale(1.1);
  }
`;

const Content = styled.div`
  flex: 1;
  margin-left: 80px;
  padding: ${({ isHome }) => (isHome ? "20px" : "0")}; 
  overflow-y: auto;
  background-color: #ecf0f1; 
`;

const UserInfoBox = styled.div`
  background: url('/back.png') no-repeat center center;
  background-size: cover;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  // max-width: 1200px;
  margin: 20px auto;
  display: flex;
  align-items: center;
  gap: 40px;
  background-position: center;
  background-size: cover;
  height: 250px;

  @media (max-width: 768px) {
    height: 300px; 
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
`;

const FeatureBoxesContainer = styled.div`
margin-top:80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; 
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
`;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/");
  };

  const isHome = location.pathname === "/home";
  return(
    <>
      <GlobalStyle />
      <AppContainer>
        <Sidebar isHome={isHome}>
          <NavItems>
            <NavItem to="/home" title="Home">
              <FaHome />
            </NavItem>
            <NavItem to="/fullleaderboard" title="Full Leaderboard">
              <FaTrophy />
            </NavItem>
            <NavItem to="/mainleaderboard" title="Main Leaderboard">
              <FaChartBar />
            </NavItem>
            <NavItem to="/form" title="Form">
              <FaWpforms />
            </NavItem>
          </NavItems>
          <LogoutButton onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </LogoutButton>
        </Sidebar>
        <Content isHome={isHome}>
          <Routes>
            <Route
              path="/home"
              element={
                <div>
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
                </div>
              }
            />
            <Route path="/mainleaderboard" element={<MainLeaderboard />} />
            <Route path="/fullleaderboard" element={<FullLeaderboard />} />
            <Route path="/form" element={<div>Form</div>} />
          </Routes>
        </Content>
      </AppContainer>
    </>
  );
};
export default App;
