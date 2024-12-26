import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Grid,useMediaQuery  } from "@mui/material";
import { styled,keyframes } from "@mui/system";

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
const Section = styled("section")({
  padding: "80px 20px",
  backgroundColor: "#f5f5f5",
});

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

const Card = styled(Box)({
  border: "1px solid #2b6777",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
  },
});

const App = () => {
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
            {/* Login Button */}
            <LoginButton inSection1={navbarTransparent}>Login</LoginButton>
          </Box>
        </Toolbar>
      </Navbar>
      <FullHeightSection id="section1" ref={(el) => (sectionRefs.current[0] = el)} />

      <Section id="section2" ref={(el) => (sectionRefs.current[1] = el)}>
  <Grid container spacing={6} alignItems="center">
    <Grid item xs={12} md={6}>
      <Typography variant="h4" sx={{ color: "#2b6777", fontWeight: "bold" }}>
        Welcome to Section 2
      </Typography>
      <Typography sx={{ marginTop: "20px", color: "#333", lineHeight: "1.8" }}>
        This section contains text on the left and a square image on the right. Use this
        section to highlight a key aspect of your service or product.
      </Typography>
    </Grid>
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          height: useMediaQuery('(max-width:600px)') ? '600px' : '400px',  
          width: useMediaQuery('(max-width:600px)') ? '100%' : '700px',  
          backgroundImage: `url(${useMediaQuery('(max-width:600px)') ? '/le1.png' : '/le.png'})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      />
    </Grid>
  </Grid>
</Section>

      <Section id="section3" ref={(el) => (sectionRefs.current[2] = el)}>
        <Typography
          variant="h4"
          sx={{ color: "#2b6777", fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}
        >
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {[1, 2, 3].map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service}>
              <Card>
                <Typography variant="h6" sx={{ color: "#2b6777", fontWeight: "bold" }}>
                  Service {service}
                </Typography>
                <Typography sx={{ marginTop: "10px", color: "#666" }}>
                  Description of service {service}. Highlight the unique aspects of your offering.
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Section 4 */}
      <Section id="section4" ref={(el) => (sectionRefs.current[3] = el)}>
        <Typography
          variant="h4"
          sx={{ color: "#2b6777", fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}
        >
          What Clients Need
        </Typography>
        <Grid container spacing={4}>
          {[1, 2, 3].map((need) => (
            <Grid item xs={12} sm={6} md={4} key={need}>
              <Card>
                <Typography variant="h6" sx={{ color: "#2b6777", fontWeight: "bold" }}>
                  Need {need}
                </Typography>
                <Typography sx={{ marginTop: "10px", color: "#666" }}>
                  Explain how your product or service addresses this specific client need.
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Section>
    </div>
  );
};

export default App;