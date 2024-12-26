import React from "react";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Landing from "./components/Landing";
import Sidebar from "./components/Sidebar";
import Homepage from "./components/Homepage";
import MainLeaderboard from "./components/MainLeaderboard";
import FullLeaderboard from "./components/FullLeaderboard";
import Admin from "./components/Admin";
import Training from "./components/Training";
import Material from "./components/Material";
import Trainee from "./components/Trainee";
import Leaderboard from "./components/Leaderboard";
import DetailedLeaderboard from "./components/DetailedLeaderboard";

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

const Content = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.showSidebar ? "80px" : "0")};
  overflow-y: auto;
  background-color: #ecf0f1;
`;

const App = () => {
  const location = useLocation();

  // Update the `sidebarRoutes` to include dynamic route patterns
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

  // Check if the current location matches any of the sidebar routes
  const showSidebar = sidebarRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  console.log("Current Path:", location.pathname);
  console.log("Show Sidebar:", showSidebar);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {showSidebar && <Sidebar />}
        <Content showSidebar={showSidebar}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/mainleaderboard" element={<MainLeaderboard />} />
            <Route path="/fullLeaderboard" element={<FullLeaderboard />} />
            <Route path="/form" element={<div>Form</div>} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/training" element={<Training />} />
            <Route path="/material" element={<Material />} />
            <Route path="/trainee" element={<Trainee />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/leaderboard/:weekId" element={<DetailedLeaderboard />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Content>
      </AppContainer>
    </>
  );
};

export default App;
