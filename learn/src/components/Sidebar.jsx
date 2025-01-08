import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaTrophy, FaChartBar, FaWpforms, FaSignOutAlt } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";

// Styled Components
const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #2b6777;
  color: #ecf0f1;
  width: 80px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0;
  transition: width 0.3s ease, margin-right 0.3s ease;

  @media (max-width: 768px) {
    width: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: -10px; /* Completely removes the gap between logos */
  margin-bottom: 5px; /* Reduced bottom margin */
`;

const Logo = styled.img`
  width: 80px;
  height: 80px; /* Adjusted height to make logos smaller */
  object-fit: contain;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
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

  &:hover {
    transform: scale(1.1);
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out successfully!");
    navigate("/");
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <Logo src="/Logo.png" alt="Logo 1" />
        <Logo src="Logo.png" alt="Logo 2" />
        <Logo src="Logo.png" alt="Logo 3" />
      </LogoContainer>
      <NavItems>
        <NavItem to="/home" title="Home">
          <FaHome />
        </NavItem>
        <NavItem to="/form" title="Form">
          <FaWpforms />
        </NavItem>
        <NavItem to="/mainleaderboard" title="Main Leaderboard">
          <FaChartBar />
        </NavItem>
        <NavItem to="/fullLeaderboard" title="Full Leaderboard">
          <FaTrophy />
        </NavItem>
        <NavItem to="/submissiont" title="Submissions">
          <FaFileAlt />
        </NavItem>
      </NavItems>
      <LogoutButton onClick={handleLogout} title="Logout">
        <FaSignOutAlt />
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
