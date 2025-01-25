import React, {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaFileAlt, FaTrophy,FaCommentDots, FaChartBar, FaWpforms, FaSignOutAlt, FaPeopleCarry, FaPeopleArrows, FaFolderMinus, FaQuoteLeft } from "react-icons/fa";
// import cookie from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { backendUrl } from "./constants";
import Cookies from "js-cookie";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  
    const handleSnackbarClose = (event, reason) => {
      if (reason === "clickaway") return; // Prevent closing on clickaway
      setSnackbarOpen(false);
    };
    const handleLogout = async () => {
      const tok = Cookies.get("token");
  
      if (!tok) {
        alert("No token found. Please log in first.");
        return;
      }
  
      try {
        const token = JSON.parse(tok);
        const response = await fetch(`${backendUrl}/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          // body: JSON.stringify({ "token":token }),
        });
  
        if (response.ok) {
          Cookies.remove("token"); // Clear the token from cookies
          setSnackbarOpen(true); // Show Snackbar
          setTimeout(() => navigate("/"), 1500); // Redirect after 1.5s
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
