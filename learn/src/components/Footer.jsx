import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

// Styled Footer container
const StyledFooter = styled("footer")(() => ({
  backgroundColor: "#2b6777",
  color: "#fff",
  padding: "20px 10px",
  textAlign: "center",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height:"10px",
  marginTop: "40px", 
}));

// Footer Component
const Footer = ({ leftLogo, rightLogo }) => {
  return (
    <StyledFooter>
      {/* Left Logo */}
      <Box component="img" src={leftLogo} alt="Left Logo" height={30} />

      {/* Footer Text */}
      <Typography variant="body2">© 2024 Your Company. All rights reserved.</Typography>

      {/* Right Logo */}
      <Box component="img" src={rightLogo} alt="Right Logo" height={30} />
    </StyledFooter>
  );
};

export default Footer;
