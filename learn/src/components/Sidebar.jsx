import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaTrophy, FaChartBar, FaWpforms, FaSignOutAlt } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import cookie from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 60px;
  }

  @media (max-width: 480px) {
    width: 50px;
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  flex-grow: 1;
  justify-content: center;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
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

  &:hover {
    transform: scale(1.1);
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const handleLogout = async () => {
    const tok = cookie.get("token");

    if (!tok) {
      alert("No token found. Please log in first.");
      return;
    }

    try {
      const token = JSON.parse(tok);
      const response = await fetch("http://localhost:2000/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        cookie.remove("token");
        setSnackbarOpen(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        const error = await response.json();
        alert(`Logout failed: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <SidebarContainer>
      <TopSection>
        <Logo src="Logo1.png" alt="Top Logo" />
      </TopSection>

      <CenterSection>
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
      </CenterSection>

      <BottomSection>
        <SmallLogo src="/logo-synergify.png" alt="Logo 1" />
        <SmallLogo src="Logo2.png" alt="Logo 2" />
        <LogoutButton onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
        </LogoutButton>
      </BottomSection>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Logged out successfully!
        </Alert>
      </Snackbar>
    </SidebarContainer>
  );
};

export default Sidebar;
