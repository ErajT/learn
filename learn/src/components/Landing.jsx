// import React, { useState, useEffect, useRef } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   Grid,
//   useMediaQuery,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Container,
//   Card,
//   CardContent,
// } from "@mui/material";
// import { styled, keyframes } from "@mui/system";
// import { Link } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import { FaBox, FaHandshake, FaShieldAlt } from "react-icons/fa";

// // Keyframes for animations
// const fadeInRight = keyframes`
//   from {
//     opacity: 0;
//     transform: translateX(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// `;

// const fadeInLeft = keyframes`
//   from {
//     opacity: 0;
//     transform: translateX(-20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateX(0);
//   }
// `;

// const parallax = keyframes`
//   0% { background-position: center top; }
//   100% { background-position: center bottom; }
// `;

// // Full-height section with dynamic background image and parallax effect
// const FullHeightSection = styled("section")(() => ({
//   height: "100vh",
//   width: "100%",
//   backgroundImage: `url(/main.png)`,
//   backgroundSize: "cover",
//   backgroundPosition: "center center",
//   position: "relative",
//   animation: `${parallax} 10s ease-in-out infinite alternate`,
//   backgroundAttachment: "fixed", // This ensures the parallax effect works well
//   "@media (max-width: 768px)": {
//     backgroundImage: `url(/main1.png)`,
//     animation: `${parallax} 5s ease-in-out infinite alternate`,
//   },
// }));


// // Styled components
// const Navbar = styled(AppBar)(({ isTransparent }) => ({
//   backgroundColor: isTransparent ? "transparent" : "#2b6777",
//   transition: "background-color 0.3s ease-in-out",
//   boxShadow: isTransparent ? "none" : "0px 4px 6px rgba(0, 0, 0, 0.1)",
// }));

// const LoginButton = styled(Button)(({ inSection1 }) => ({
//   borderRadius: "20px",
//   padding: "8px 20px",
//   fontWeight: "bold",
//   fontSize: "14px",
//   backgroundColor: inSection1 ? "rgba(255, 255, 255, 0.8)" : "#f5f5f5",
//   color: inSection1 ? "#2b6777" : "#2b6777",
//   border: "1px solid #2b6777",
//   "&:hover": {
//     backgroundColor: "#2b6777",
//     color: "#fff",
//   },
// }));

// const Section = styled("section")(() => ({
//   padding: "80px 20px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   background: "linear-gradient(to right, #e1eef6, #ffffff)",
//   boxShadow: "0px 8px 16px rgba(0, 0, 0, 1.2)",
// }));

// const SectionContent = styled(Container)(() => ({
//   maxWidth: "1200px",
// }));

// const SectionHeading = styled(Typography)(() => ({
//   fontSize: "4rem",
//   fontWeight: "bold",
//   marginBottom: "40px",
//   color: "#2b6777",
//   textAlign: "center",
// }));

// const ImageWrapper = styled("div")(() => ({
//   boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
//   borderRadius: "10px",
//   overflow: "hidden",
// }));

// const Footer = styled("footer")(() => ({
//   backgroundColor: "#2b6777",
//   color: "#fff",
//   padding: "20px 0",
//   textAlign: "center",
// }));

// // Main App Component
// const App = () => {
//   const [navbarTransparent, setNavbarTransparent] = useState(true);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const sectionRefs = useRef([]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const sectionId = entry.target.id;
//             setNavbarTransparent(sectionId === "section1");
//           }
//         });
//       },
//       { threshold: 0.7 }
//     );

//     sectionRefs.current.forEach((section) => {
//       if (section) observer.observe(section);
//     });

//     return () => {
//       sectionRefs.current.forEach((section) => {
//         if (section) observer.unobserve(section);
//       });
//     };
//   }, []);

//   const scrollToSection = (id) => {
//     document.getElementById(id).scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div>
//       <Navbar position="fixed" isTransparent={navbarTransparent}>
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             Logo
//           </Typography>
//           {isMobile ? (
//             <>
//               <IconButton onClick={() => setDrawerOpen(true)}>
//                 <MenuIcon sx={{ color: navbarTransparent ? "#fff" : "#f5f5f5" }} />
//               </IconButton>
//               <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
//                 <List>
//                   {["section1", "section2", "section3", "section4"].map((section) => (
//                     <ListItem
//                       button
//                       key={section}
//                       onClick={() => {
//                         scrollToSection(section);
//                         setDrawerOpen(false);
//                       }}
//                     >
//                       <ListItemText primary={section.toUpperCase()} />
//                     </ListItem>
//                   ))}
//                   <Link to="/login" style={{ textDecoration: "none" }}>
//                     <Button sx={{ margin: "20px", background: "#2b6777", color: "#fff" }}>
//                       Login
//                     </Button>
//                   </Link>
//                 </List>
//               </Drawer>
//             </>
//           ) : (
//             <Box>
//               {["section1", "section2", "section3", "section4"].map((section) => (
//                 <Button
//                   key={section}
//                   onClick={() => scrollToSection(section)}
//                   sx={{
//                     color: navbarTransparent ? "#fff" : "#f5f5f5",
//                     fontWeight: "bold",
//                     marginRight: "20px",
//                   }}
//                 >
//                   {section.toUpperCase()}
//                 </Button>
//               ))}
//               <Link to="/login" style={{ textDecoration: "none" }}>
//                 <LoginButton inSection1={navbarTransparent}>Login</LoginButton>
//               </Link>
//             </Box>
//           )}
//         </Toolbar>
//       </Navbar>

//       {/* <Section id="section1" ref={(el) => (sectionRefs.current[0] = el)} /> */}
//       <FullHeightSection id="section1" ref={(el) => (sectionRefs.current[0] = el)} />


//       {["section2", "section3"].map((id, index) => (
//         <Section id={id} ref={(el) => (sectionRefs.current[index + 1] = el)} key={id}>
//           <SectionContent>
//             <Grid
//               container
//               spacing={4}
//               alignItems="center"
//               direction={isMobile ? "column-reverse" : id === "section3" ? "row-reverse" : "row"}
//             >
//               <Grid
//                 item
//                 xs={12}
//                 md={6}
//                 sx={{
//                   animation: `${id === "section2" ? fadeInRight : fadeInLeft} s ease-in-out`,
//                 }}
//               >
//                 <ImageWrapper>
//                   <img
//                     src={id === "section2" ? "/lap.png" : "/form.png"}
//                     alt={`Section ${index + 2}`}
//                     style={{ width: "100%" }}
//                   />
//                 </ImageWrapper>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Typography
//                   variant="h4"
//                   sx={{ marginBottom: "20px", color: "#2b6777", fontSize: "3rem" }}
//                 >
//                   {id === "section2" ? "Leaderboard" : "Application Form"}
//                 </Typography>
//                 <Typography sx={{ fontSize: "1.6rem", color: "#2b6777" }}>
//                   {id === "section2" ? "Celebrate your achievements and see how you rank! The leaderboard highlights top performers, fostering healthy competition and motivation. Keep applying, sharing, and climbing to the top!" : "Submit your progress and let your actions speak! Log your applications through text, photos, or references to showcase your dedication. Each submission brings you closer to the top of the leaderboard and inspires others in the community."} 
//                 </Typography>
//               </Grid>
//             </Grid>
//           </SectionContent>
//         </Section>
//       ))}
// <Section
//   id="section4"
//   ref={(el) => (sectionRefs.current[3] = el)}
//   style={{
//     background: "linear-gradient(to right, #e1eef6, #ffffff)",
//     padding: "50px 20px",
//   }}
// >
//   <SectionContent>
//     <SectionHeading>What Clients Need</SectionHeading>
//     <Grid container spacing={4}>
//       {["Box 1", "Box 2", "Box 3"].map((box, index) => (
//         <Grid item xs={12} sm={4} key={index}>
//           <Card
//             sx={{
//               height: "280px", // Reduced height
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "space-around",
//               borderRadius: "16px",
//               boxShadow: "0 8px 20px rgba(0, 0, 0, 0.6)",
//               transition: "transform 0.3s ease, box-shadow 0.3s ease",
//               "&:hover": {
//                 transform: "translateY(-10px)",
//                 boxShadow: "0 16px 30px rgba(0, 0, 0, 0.6)",
//               },
//               padding: "15px",
//               background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 width: "65px", // Slightly smaller icon container
//                 height: "65px",
//                 borderRadius: "50%",
//                 backgroundColor: "#2b6777",
//               }}
//             >
//               {index === 0 && <FaBox size={30} color="#fff" />} {/* Reduced icon size */}
//               {index === 1 && <FaHandshake size={30} color="#fff" />}
//               {index === 2 && <FaShieldAlt size={30} color="#fff" />}
//             </Box>
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: "bold",
//                 fontSize: "1.1rem", // Slightly smaller title font
//                 textAlign: "center",
//                 color: "#2b6777",
//                 marginBottom: "8px", // Reduced gap
//               }}
//             >
//               {box}
//             </Typography>
//             <Typography
//               sx={{
//                 fontSize: "0.95rem", // Adjusted description font size slightly
//                 textAlign: "center",
//                 color: "#555",
//               }}
//             >
//               Brief description for {box}.
//             </Typography>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   </SectionContent>
// </Section>



//       <Footer>
//         <Typography variant="body2">© 2024 Your Company. All rights reserved.</Typography>
//       </Footer>
//     </div>
//   );
// };

// export default App;


import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { styled, keyframes, fontSize } from "@mui/system";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { FaBox, FaHandshake, FaShieldAlt } from "react-icons/fa";

// Define custom font
const theme = createTheme({
  typography: {
    fontFamily: "Anaheim, Arial, sans-serif",
  },
});

// Inject @font-face rule
const GlobalStyles = styled("style")(() => ({
  "@font-face": {
    fontFamily: "Anaheim",
    src: "url('/Anaheim.ttf') format('truetype')",
  },
}));
const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;
const parallax = keyframes`
  0% { background-position: center top; }
  // 100% { background-position: center bottom; }
`;

// Full-height section with dynamic background image and parallax effect
const FullHeightSection = styled("section")(() => ({
  height: "100vh",
  width: "100%",
  backgroundImage: `url(/main.png)`,
  backgroundSize: "cover",
  backgroundPosition: "center center",
  position: "relative",
  animation: `${parallax} 10s ease-in-out infinite alternate`,
  backgroundAttachment: "fixed", // This ensures the parallax effect works well
  display: "flex", // Flexbox to position content easily
  justifyContent: "center", // Horizontally center content
  alignItems: "center", // Vertically center content
  color: "#fff", // Default font color for text
  textAlign: "center", // Center align text
  "@media (max-width: 1200px)": {
    backgroundImage: `url(/main1.png)`,
    animation: `${parallax} 5s ease-in-out infinite alternate`,
  },
}));
const TextBox = styled("div")(() => ({
  position: "absolute", // Position the text box relative to the section
  left: "5%", // Default left position for large screens
  top: "60%", // Default top position (vertically centered for large screens)
  transform: "translateY(-50%)", // Adjust for vertical centering
  padding: "20px 40px", // Spacing inside the box
  borderRadius: "8px", // Rounded corners
  fontSize: "1.75rem", // Font size for better visibility
  fontWeight: "600", // Thicker font weight
  maxWidth: "40%", // Prevent the box from being too wide
  height: "auto", // Allow height to adjust based on content
  maxHeight: "80vh", // Maximum height to ensure it doesn't overflow the screen
  overflow: "hidden", // Hide any content that exceeds max height

  // Media queries for responsiveness
  "@media (max-width: 1200px)": {
    left: "10%", // Center the text box horizontally on smaller screens
    top: "10%", // Move the text box to the top
    transform: "none", // Remove transform to prevent centering
    maxWidth: "90%", // Wider box for smaller screens
    fontSize: "2.3rem", // Adjust font size for medium screens
  },

  "@media (max-width: 650px)": {
    left: "10%", // Center the text box horizontally on smaller screens
    top: "10%", // Move the text box to the top
    transform: "none", // Remove transform to prevent centering
    maxWidth: "90%", // Wider box for smaller screens
    fontSize: "1.3rem", // Smaller font size for better readability on smaller screens
  },

  "@media (max-width: 380px)": {
    left: "10%", // Keep the text box aligned
    top: "10%", // Position the text box near the top
    transform: "none", // No vertical centering on smaller screens
    maxWidth: "90%", // Take up more width for very small screens
    fontSize: "1rem", // Smaller font size for very small screens
  },
}));




// Styled components
const Navbar = styled(AppBar)(({ isTransparent }) => ({
  backgroundColor: isTransparent ? "transparent" : "#2b6777",
  transition: "background-color 0.3s ease-in-out",
  boxShadow: isTransparent ? "none" : "0px 4px 6px rgba(0, 0, 0, 0.1)",
}));

const LoginButton = styled(Button)(({ inSection1 }) => ({
  borderRadius: "20px",
  padding: "8px 20px",
  fontWeight: "bold",
  fontSize: "17px",
  backgroundColor: inSection1 ? "rgba(255, 255, 255, 0.8)" : "#f5f5f5",
  color: inSection1 ? "#2b6777" : "#2b6777",
  border: "1px solid #2b6777",
  "&:hover": {
    backgroundColor: "#2b6777",
    color: "#fff",
  },
}));

const Section = styled("section")(() => ({
  padding: "80px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(to right, #e1eef6, #ffffff)",
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 1.2)",
}));

const SectionContent = styled(Container)(() => ({
  maxWidth: "1200px",
}));

const SectionHeading = styled(Typography)(() => ({
  fontSize: "5rem",
  fontWeight: "bold",
  marginBottom: "40px",
  color: "#2b6777",
  textAlign: "center",
}));

const ImageWrapper = styled("div")(() => ({
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
  borderRadius: "10px",
  overflow: "hidden",
}));

const Footer = styled("footer")(() => ({
  backgroundColor: "#2b6777",
  color: "#fff",
  padding: "20px 0",
  textAlign: "center",
}));


const App = () => {
  const [navbarTransparent, setNavbarTransparent] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <div>
      <Navbar position="fixed" isTransparent={navbarTransparent}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Logo
          </Typography>
          {isMobile ? (
            <>
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon sx={{ color: navbarTransparent ? "#fff" : "#f5f5f5" }} />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <List>
                  {["section1", "section2", "section3", "section4"].map((section) => (
                    <ListItem
                      button
                      key={section}
                      onClick={() => {
                        scrollToSection(section);
                        setDrawerOpen(false);
                      }}
                    >
                      <ListItemText primary={section.toUpperCase()} />
                    </ListItem>
                  ))}
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <Button sx={{ margin: "20px", background: "#2b6777", color: "#fff" }}>
                      Login
                    </Button>
                  </Link>
                </List>
              </Drawer>
            </>
          ) : (
            <Box>
              {["section1", "section2", "section3", "section4"].map((section) => (
                <Button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  sx={{
                    color: navbarTransparent ? "#fff" : "#f5f5f5",
                    fontWeight: "bold",
                    marginRight: "20px",
                    fontSize:"18px",
                  }}
                >
                  {section.toUpperCase()}
                </Button>
              ))}
              <Link to="/login" style={{ textDecoration: "none" }}>
                <LoginButton inSection1={navbarTransparent}>Login</LoginButton>
              </Link>
            </Box>
          )}
        </Toolbar>
      </Navbar>
      <FullHeightSection id="section1" ref={(el) => (sectionRefs.current[0] = el)} >
      <TextBox>
        {/* <h1>Welcome to Our Website</h1> */}
        <p>Track your growth, inspire others, and rise to the top! Showcase how you apply training concepts, compete on a dynamic leaderboard, and explore a hub of shared ideas. Generate personalized PDFs and turn every submission into a step toward success
      </p>
      </TextBox>
    </FullHeightSection>

      {/* <Section id="section1" ref={(el) => (sectionRefs.current[0] = el)} /> */}
      {/* <FullHeightSection id="section1" ref={(el) => (sectionRefs.current[0] = el)} /> */}


      {["section2", "section3"].map((id, index) => (
  <Section id={id} ref={(el) => (sectionRefs.current[index + 1] = el)} key={id}>
    <SectionContent>
      <Grid
        container
        spacing={4}
        alignItems="center"
        direction={isMobile ? "column-reverse" : id === "section3" ? "row-reverse" : "row"}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            animation: `${id === "section2" ? fadeInRight : fadeInLeft} 1s ease-in-out`,
            textAlign: "center", 
          }}
        >
          <ImageWrapper>
            <img
              src={id === "section2" ? "/lap.png" : "/form.png"}
              alt={`Section ${index + 2}`}
              style={{ width: "100%", height: "auto" }} 
            />
          </ImageWrapper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{
              marginBottom: "20px",
              color: "#2b6777",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" }, 
              fontWeight: "bold",
              textAlign: { xs: "center", md: "left" }, 
            }}
          >
            {id === "section2" ? "Leaderboard" : "Application Form"}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.5rem", md: "1.75rem" }, 
              color: "#2b6777",
              fontStyle: "italic",
              textAlign: { xs: "center", md: "left" }, 
              maxWidth: "600px", 
              margin: "0 auto", 
            }}
          >
            {id === "section2"
              ? "Celebrate your achievements and see how you rank! The leaderboard highlights top performers, fostering healthy competition and motivation. Keep applying, sharing, and climbing to the top!"
              : "Submit your progress and let your actions speak! Log your applications through text, photos, or references to showcase your dedication. Each submission brings you closer to the top of the leaderboard and inspires others in the community."}
          </Typography>
        </Grid>
      </Grid>
    </SectionContent>
  </Section>
))}

<Section
  id="section4"
  ref={(el) => (sectionRefs.current[3] = el)}
  style={{
    background: "linear-gradient(to right, #e1eef6, #ffffff)",
    padding: "50px 20px",
  }}
>
  <SectionContent>
    <SectionHeading>What Clients Need</SectionHeading>
    <Grid container spacing={4}>
      {["Participants can document their training application through text, photos, or emails, capturing insights and achievements for measurable growth.", "The leaderboard promotes healthy competition by ranking participants, motivating users to stay consistent and excel.", "Showcasing submissions fosters collaboration, while personalized PDFs help track and share progress."].map((box, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card
            sx={{
              height: "280px", // Reduced height
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.6)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 16px 30px rgba(0, 0, 0, 0.6)",
              },
              padding: "15px",
              background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "65px", // Slightly smaller icon container
                height: "65px",
                borderRadius: "50%",
                backgroundColor: "#2b6777",
              }}
            >
              {index === 0 && <FaBox size={30} color="#fff" />} {/* Reduced icon size */}
              {index === 1 && <FaHandshake size={30} color="#fff" />}
              {index === 2 && <FaShieldAlt size={30} color="#fff" />}
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem", // Slightly smaller title font
                textAlign: "center",
                color: "#2b6777",
                marginBottom: "8px", // Reduced gap
              }}
            >
              {box}
            </Typography>
            {/* <Typography
              sx={{
                fontSize: "0.95rem", // Adjusted description font size slightly
                textAlign: "center",
                color: "#555",
              }}
            >
              Brief description for {box}.
            </Typography> */}
          </Card>
        </Grid>
      ))}
    </Grid>
  </SectionContent>
</Section>



      <Footer>
        <Typography variant="body2">© 2024 Your Company. All rights reserved.</Typography>
      </Footer>
    </div>
    </ThemeProvider>
  );
};

export default App;
