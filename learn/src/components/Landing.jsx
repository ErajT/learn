import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Grid, useMediaQuery } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { Link } from "react-router-dom"; // Import Link for navigation

const parallax = keyframes`
  0% { background-position: center top; }
  100% { background-position: center bottom; }
`;

const FullHeightSection = styled("section")(() => ({
  height: "100vh",
  width: "100%",
  backgroundImage: `url(/main.png)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  animation: `${parallax} 10s ease-in-out infinite alternate`,
  "@media (max-width: 768px)": {
    backgroundImage: `url(/main1.png)`,
    animation: `${parallax} 5s ease-in-out infinite alternate`,
  },
}));

const Navbar = styled(AppBar)(({ isTransparent }) => ({
  backgroundColor: isTransparent ? "transparent" : "#2b6777",
  transition: "background-color 0.3s ease-in-out",
  boxShadow: isTransparent ? "none" : "0px 4px 6px rgba(0, 0, 0, 0.1)",
}));

const LoginButton = styled(Button)(({ inSection1 }) => ({
  borderRadius: "20px",
  padding: "8px 20px",
  fontWeight: "bold",
  fontSize: "14px",
  backgroundColor: inSection1 ? "rgba(255, 255, 255, 0.8)" : "#f5f5f5",
  color: inSection1 ? "#2b6777" : "#2b6777",
  border: "1px solid #2b6777",
  transition: "background-color 0.3s, color 0.3s",
  "&:hover": {
    backgroundColor: inSection1 ? "#2b6777" : "#2b6777",
    color: "#fff",
  },
}));

const App = () => {
  const backendUrl = "http://localhost:2000";  // Use this in API calls
  const [navbarTransparent, setNavbarTransparent] = useState(true);

  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setNavbarTransparent(sectionId === "section1");
          }
        });
      },
      { threshold: 0.7 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Navbar position="fixed" isTransparent={navbarTransparent}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Logo
          </Typography>
          <Box>
            {["section1", "section2", "section3", "section4"].map((section) => (
              <Button
                key={section}
                onClick={() => scrollToSection(section)}
                sx={{
                  color: navbarTransparent ? "#fff" : "#f5f5f5",
                  fontWeight: "bold",
                  marginRight: "20px",
                }}
              >
                {section.toUpperCase()}
              </Button>
            ))}
            {/* Login Button with Link */}
            <Link to="/login" style={{ textDecoration: "none" }}>
              <LoginButton inSection1={navbarTransparent}>Login</LoginButton>
            </Link>
          </Box>
        </Toolbar>
      </Navbar>
      <FullHeightSection id="section1" ref={(el) => (sectionRefs.current[0] = el)} />
      {/* Add other sections here */}
    </div>
  );
};

export default App;
