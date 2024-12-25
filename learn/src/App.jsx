
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
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

const Content = styled.div.attrs(props => ({
}))`
  flex: 1;
  margin-left: ${(props) => (props.showSidebar ? "80px" : "0")};
  overflow-y: auto;
  background-color: #ecf0f1;
`;

const App = () => {
  const location = useLocation();

  const sidebarRoutes = ["/home", "/mainleaderboard", "/fullLeaderboard", "/admin","/Training","/material","/trainee"];

  const showSidebar = sidebarRoutes.includes(location.pathname);

  console.log("Current Path:", location.pathname);
  console.log("Show Sidebar:", showSidebar);

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {showSidebar && <Sidebar />}
        <Content showSidebar={showSidebar}>
          <Routes>
            <Route path="/" />
            <Route path="/home" element={<Homepage />} />
            <Route path="/mainleaderboard" element={<MainLeaderboard />} />
            <Route path="/fullLeaderboard" element={<FullLeaderboard />} />
            <Route path="/form" element={<Application />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/training" element={<Training />} />
            <Route path="/Material" element={<Material />} />
            <Route path="/trainee" element={<Trainee />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPass />} />
            <Route path="/reset/:token" element={<ResetPass />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Content>
      </AppContainer>
    </>
  );
};

export default App;
