// import React from "react";
// import { Routes, Route, useLocation, matchPath } from "react-router-dom";
// import styled, { createGlobalStyle } from "styled-components";
// import Landing from "./components/Landing";
// import Sidebar from "./components/Sidebar";
// import AdminSidebar from "./components/AdminSidebar";
// import AdminSide from "./components/AdminSide";
// import Side from "./components/Side";
// import Homepage from "./components/Homepage";
// import ParticipantHome from "./components/ParticipantHome";
// import MainLeaderboard from "./components/MainLeaderboard";
// import FullLeaderboard from "./components/FullLeaderboard";
// import Application from "./components/Application";
// import Quotations from "./components/Quotations";
// import Admin from "./components/Admin";
// import Training from "./components/Training";
// import Material from "./components/Material";
// import Submission from "./components/Submission";
// import Submissiont from "./components/Submissiont";
// import Trainee from "./components/Trainee";
// import Login from "./components/login";
// import ForgotPass from "./components/ForgotPass";
// import ResetPass from "./components/ResetPass";
// import Leaderboard from "./components/Leaderboard";
// import DetailedLeaderboard from "./components/DetailedLeaderboard";
// import UnauthorizedAccess from "./components/UnauthorizedAccess";
// import RoleAuthorizer from "./components/RoleAuthorizer"; // Import the RoleAuthorizer component

// const GlobalStyle = createGlobalStyle`
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   html, body {
//     height: 100%;
//     overflow: hidden;
//   }
// `;

// const AppContainer = styled.div`
//   display: flex;
//   height: 100vh;
//   width: 100vw;
//   overflow: hidden;
//   background-color: #ecf0f1;
// `;

// const Content = styled.div.attrs((props) => ({}))`
//   flex: 1;
//   margin-left: ${(props) => (props.showSidebar ? "80px" : "0")};
//   overflow-y: auto;
//   background-color: #ecf0f1;
// `;

// const App = () => {
//   const location = useLocation();

//   // Define routes that require the sidebar
//   const sidebarRoutes = [
//     "/home",
//     "/mainleaderboard",
//     "/fullLeaderboard",
//     "/form",
//     "/submissiont",
//   ];

//   const AdminSidebarRoutes = [
//     "/training",
//     "/material",
//     "/trainee",
//     "/leaderboard",
//     "/submission",
//     "/leaderboard/:weekId",
//     "/quotation"
//   ];

//   const AdminSideRoutes = [
//     "/admin",
//   ];

//   const SideRoutes = [
//     "/ParticipantHome",
//   ];

//   // Check if the current location matches any of the sidebar routes
//   const showSidebar = sidebarRoutes.some((route) =>
//     matchPath(route, location.pathname)
//   );

//    // Check if the current location matches any of the sidebar routes
//    const showAdminSidebar = AdminSidebarRoutes.some((route) =>
//     matchPath(route, location.pathname)
//   );

//   const showAdminSide = AdminSideRoutes.some((route) =>
//     matchPath(route, location.pathname)
//   );

//   const showSide = SideRoutes.some((route) =>
//     matchPath(route, location.pathname)
//   );

//   return (
//     <>
//       <GlobalStyle />
//       <AppContainer>
//         {showSidebar && <Sidebar /> }
//         {showAdminSidebar && <AdminSidebar />}
//         {showAdminSide && <AdminSide/>}
//         {showSide && <Side/>}
//         <Content showSidebar={showSidebar || showAdminSidebar || showAdminSide || showSide}>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Landing />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/forgot" element={<ForgotPass />} />
//             <Route path="/reset/:token" element={<ResetPass />} />
//             <Route path="/unauthorized" element={<UnauthorizedAccess />} />

//             {/* Protected Routes for trainee */}
//             <Route element={<RoleAuthorizer allowedRole="trainee" />}>
//             <Route path="/ParticipantHome" element={<ParticipantHome />} />
//               <Route path="/home" element={<Homepage />} />
//               <Route path="/fullLeaderboard" element={<FullLeaderboard />} />
//               <Route path="/mainLeaderboard" element={<MainLeaderboard />} />
//               <Route path="/form" element={<Application />} />
//               <Route path="/submissiont" element={<Submissiont />} />
//             </Route>

//             {/* Grouping Admin-Specific Routes */}
//             <Route element={<RoleAuthorizer allowedRole="admin" />}>
//               <Route path="/admin" element={<Admin />} />
//               <Route path="/training" element={<Training />} />
//               <Route path="/material" element={<Material />} />
//               <Route path="/trainee" element={<Trainee />} />
//               <Route path="/leaderboard" element={<Leaderboard />} />
//               <Route path="/leaderboard/:weekId" element={<DetailedLeaderboard />} />
//               <Route path="/submission" element={<Submission />} />
//               <Route path="/quotation" element={<Quotations />} />
//             </Route>

//             {/* Catch-all Route */}
//             <Route path="*" element={<div>Page Not Found</div>} />
//           </Routes>
//         </Content>
//       </AppContainer>
//     </>
//   );
// };



// export default App;



import React from "react";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Footer from "./components/Footer"; // Import Footer component
import Landing from "./components/Landing";
import Sidebar from "./components/Sidebar";
import AdminSidebar from "./components/AdminSidebar";
import AdminSide from "./components/AdminSide";
import Side from "./components/Side";
import Homepage from "./components/Homepage";
import ParticipantHome from "./components/ParticipantHome";
import MainLeaderboard from "./components/MainLeaderboard";
import FullLeaderboard from "./components/FullLeaderboard";
import Application from "./components/Application";
import Quotations from "./components/Quotations";
import Admin from "./components/Admin";
import Training from "./components/Training";
import Material from "./components/Material";
import Submission from "./components/Submission";
import Submissiont from "./components/Submissiont";
import Trainee from "./components/Trainee";
import Login from "./components/login";
import ForgotPass from "./components/ForgotPass";
import ResetPass from "./components/ResetPass";
import Leaderboard from "./components/Leaderboard";
import DetailedLeaderboard from "./components/DetailedLeaderboard";
import UnauthorizedAccess from "./components/UnauthorizedAccess";
import RoleAuthorizer from "./components/RoleAuthorizer";

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
  display: flex;
  flex-direction: column; /* Ensures footer stays at the bottom */
`;

const App = () => {
  const location = useLocation();

  // Define routes that require the sidebar
  const sidebarRoutes = [
    "/home",
    "/mainleaderboard",
    "/fullLeaderboard",
    "/form",
    "/submissiont",
  ];

  const AdminSidebarRoutes = [
    "/training",
    "/material",
    "/trainee",
    "/leaderboard",
    "/submission",
    "/leaderboard/:weekId",
    "/quotation",
  ];

  const AdminSideRoutes = ["/admin"];

  const SideRoutes = ["/ParticipantHome"];

  // Check if the current location matches any of the sidebar routes
  const showSidebar = sidebarRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  const showAdminSidebar = AdminSidebarRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  const showAdminSide = AdminSideRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  const showSide = SideRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {showSidebar && <Sidebar />}
        {showAdminSidebar && <AdminSidebar />}
        {showAdminSide && <AdminSide />}
        {showSide && <Side />}
        <Content showSidebar={showSidebar || showAdminSidebar || showAdminSide || showSide}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPass />} />
            <Route path="/reset/:token" element={<ResetPass />} />
            <Route path="/unauthorized" element={<UnauthorizedAccess />} />

            {/* Protected Routes for trainee */}
            <Route element={<RoleAuthorizer allowedRole="trainee" />}>
              <Route path="/ParticipantHome" element={<ParticipantHome />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/fullLeaderboard" element={<FullLeaderboard />} />
              <Route path="/mainLeaderboard" element={<MainLeaderboard />} />
              <Route path="/form" element={<Application />} />
              <Route path="/submissiont" element={<Submissiont />} />
            </Route>

            {/* Grouping Admin-Specific Routes */}
            <Route element={<RoleAuthorizer allowedRole="admin" />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/training" element={<Training />} />
              <Route path="/material" element={<Material />} />
              <Route path="/trainee" element={<Trainee />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/leaderboard/:weekId" element={<DetailedLeaderboard />} />
              <Route path="/submission" element={<Submission />} />
              <Route path="/quotation" element={<Quotations />} />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
          
          {/* Footer is always visible at the bottom */}
          <Footer leftLogo="path/to/left-logo.png" rightLogo="path/to/right-logo.png" />
        </Content>
      </AppContainer>
    </>
  );
};

export default App;
