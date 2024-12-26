import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Landing from "./components/Landing";
import Sidebar from "./components/Sidebar";
import Homepage from "./components/Homepage";
import MainLeaderboard from "./components/MainLeaderboard";
import FullLeaderboard from "./components/FullLeaderboard";
import Application from "./components/Application";
import Admin from "./components/Admin";
import Training from "./components/Training";
import Material from "./components/Material";
import Trainee from "./components/Trainee";
import Login from "./components/login";
import ForgotPass from "./components/ForgotPass";
import ResetPass from "./components/ResetPass";
import Leaderboard from "./components/Leaderboard";
import DetailedLeaderboard from "./components/DetailedLeaderboard";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import RoleAuthorizer from "./components/RoleAuthorizer"; // Import the RoleAuthorizer component

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

const Content = styled.div.attrs((props) => ({}))`
  flex: 1;
  margin-left: ${(props) => (props.showSidebar ? "80px" : "0")};
  overflow-y: auto;
  background-color: #ecf0f1;
`;

const App = () => {
  const location = useLocation();

  // Define routes that require the sidebar
  const sidebarRoutes = [
    "/home",
    "/mainleaderboard",
    "/fullLeaderboard",
    "/admin",
    "/training",
    "/material",
    "/trainee",
    "/leaderboard",
    "/leaderboard/:weekId",
  ];

  const showSidebar = sidebarRoutes.includes(location.pathname);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {showSidebar && <Sidebar />}
        <Content showSidebar={showSidebar}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPass />} />
            <Route path="/reset/:token" element={<ResetPass />} />
            <Route path="/unauthorized" element={<UnauthorizedAccess />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <RoleAuthorizer allowedRole="trainee">
                  <Homepage />
                </RoleAuthorizer>
              }
            />
            <Route
              path="/mainleaderboard"
              element={
                <RoleAuthorizer allowedRole="trainee">
                  <MainLeaderboard />
                </RoleAuthorizer>
              }
            />
            <Route
              path="/fullLeaderboard"
              element={
                <RoleAuthorizer allowedRole="trainee">
                  <FullLeaderboard />
                </RoleAuthorizer>
              }
            />
            <Route
              path="/form"
              element={
                <RoleAuthorizer allowedRole="trainee">
                  <Application />
                </RoleAuthorizer>
              }
            />

            {/* Grouping Admin-Specific Routes */}
            <Route element={<RoleAuthorizer allowedRole="admin" />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/training" element={<Training />} />
              <Route path="/material" element={<Material />} />
              <Route path="/trainee" element={<Trainee />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/leaderboard/:weekId" element={<DetailedLeaderboard />} />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Content>
      </AppContainer>
    </>
  );
};

export default App;
