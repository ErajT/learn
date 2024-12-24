import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaTrophy, FaChartBar, FaWpforms, FaSignOutAlt } from "react-icons/fa";

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
  justify-content: center;
  align-items: center;
  padding: 20px 0;
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
      <NavItems>
        <NavItem to="/home" title="Home">
          <FaHome />
        </NavItem>
        <NavItem to="/fullLeaderboard" title="Full Leaderboard">
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
    </SidebarContainer>
  );
};

export default Sidebar;
