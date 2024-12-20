import React, { useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MainLeaderboard from "./components/MainLeaderboard";
import FullLeaderboard from "./components/FullLeaderboard";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  margin: 0; 
  padding: 0;
   margin: -10px; 
  padding: 0; 
`;

const Sidebar = styled.div`
  background-color: rgb(48, 57, 67); 
  color: #ecf0f1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ isOpen }) => (isOpen ? "200px" : "0")}; 
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  z-index: 1000;
  box-shadow: ${({ isOpen }) =>
    isOpen ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "none"};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  @media (min-width: 768px) {
    width: 300px;
    height: 100%;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease-in-out;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #1a252f;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Logo = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 15px;
`;

const NavLinkStyled = styled(NavLink)`
  color: #ecf0f1;
  text-decoration: none;
  padding: 15px 20px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;

  &.active {
    background-color: #1abc9c;
    color: #fff;
    font-weight: bold;
  }

  &:hover {
    background-color: #34495e;
    color: #fff;
  }
`;

const LogoutButton = styled.button`
  margin: 20px;
  margin-top: auto;
  padding: 10px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const HamburgerMenu = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  font-size: 1.5rem;
  background: transparent;
  color: #2c3e50;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    color: #1abc9c;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  transition: margin-left 0.3s ease-in-out;
  margin-top: -20px; 
   margin-right: -20px;
    margin-left: -20px;
`;

const UserInfoBox = styled.div`
  background: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
`;

const ImageBox = styled.div`
  background: #1abc9c;
  border-radius: 8px;
  height: 200px;
  width: 100%;
  margin-bottom: 20px;
`;

const InfoBoxesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const InfoBox = styled.div`
  background: #34495e;
  padding: 20px;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleNavLinkClick = () => {
    setIsSidebarOpen(false); 
  };

  return (
    <AppContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <Logo src="logo.png" alt="Logo" /> Dashboard
        </SidebarHeader>
        <nav>
          <NavLinkStyled to="/mainleaderboard" onClick={handleNavLinkClick}>
            Main Leaderboard
          </NavLinkStyled>
          <NavLinkStyled to="/fullleaderboard" onClick={handleNavLinkClick}>
            Full Leaderboard
          </NavLinkStyled>
        </nav>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>

      <HamburgerMenu onClick={toggleSidebar}>☰</HamburgerMenu>

      {/* Main Content */}
      <Content isOpen={isSidebarOpen}>
        <Routes>
          <Route path="/mainleaderboard" element={<MainLeaderboard />} />
          <Route path="/fullleaderboard" element={<FullLeaderboard />} />
        </Routes>

        <UserInfoBox>
          <ImageBox /> 
          <InfoBoxesContainer>
            <InfoBox>User Info Box 1</InfoBox>
            <InfoBox>User Info Box 2</InfoBox>
            <InfoBox>User Info Box 3</InfoBox>
          </InfoBoxesContainer>
        </UserInfoBox>
      </Content>
    </AppContainer>
  );
};

export default App;
