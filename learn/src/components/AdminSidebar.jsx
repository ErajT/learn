import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaFileAlt, FaTrophy,FaCommentDots, FaChartBar, FaWpforms, FaSignOutAlt, FaPeopleCarry, FaPeopleArrows, FaFolderMinus, FaQuoteLeft } from "react-icons/fa";

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #2b6777;
  color: #ecf0f1;
  width: 80px; /* Default width */
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  transition: width 0.3s ease, margin-right 0.3s ease; /* Smooth transition for width and margin change */

  /* Media query for smaller screens */
  @media (max-width: 768px) {
    width: 60px; /* Slightly smaller width on smaller screens */
    padding: 0px 0; /* Adjust padding to avoid excessive gap */
    margin-right: 0; /* Remove right margin */
  }

  /* Media query for very small screens (e.g., mobile devices) */
  @media (max-width: 480px) {
    width: 50px; /* Even smaller width */
    padding: 0px 0; /* Adjust padding further */
    margin-right: 0; /* Remove right margin */
  }
`;


const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px; /* Default gap */
  
  /* Adjust gap for smaller screens */
  @media (max-width: 768px) {
    gap: 30px; /* Smaller gap on smaller screens */
  }

  @media (max-width: 480px) {
    gap: 30px; /* Even smaller gap on very small screens */
  }
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
const SmallLogo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
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
      <NavItems>
        <NavItem to="/admin" title="Home">
          <FaHome />
        </NavItem>
        <NavItem to="/material" title="Material">
          <FaFolderMinus />
        </NavItem>
        <NavItem to="/trainee" title="Trainee">
          <FaPeopleArrows />
        </NavItem>
        <NavItem to="/leaderboard" title="Leaderboard">
          <FaChartBar />
        </NavItem>
        <NavItem to="/submission" title="Submissions">
          <FaFileAlt />
        </NavItem>
        <NavItem to="/quotation" title="Quotations">
          <FaQuoteLeft />
        </NavItem>
        <NavItem to="/chatbot" title="Home">
          <FaCommentDots />
        </NavItem>
      </NavItems>
      <SmallLogo src="/logo-synergify.png" alt="Logo 1" />
      <SmallLogo src="Logo2.png" alt="Logo 2" />
    
      <LogoutButton onClick={handleLogout} title="Logout">
        <FaSignOutAlt />
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
