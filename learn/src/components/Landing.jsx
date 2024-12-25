import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Snackbar, CircularProgress, Box, Grid } from '@mui/material';
import { Link as ScrollLink, Element } from 'react-scroll';

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLoginClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenSnackbar(true);
    }, 1500);
  };

  const Section = ({ id, title, content, children }) => (
    <Element name={id} style={{ padding: '60px 0', backgroundColor: '#f4f4f4', textAlign: 'center' }}>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ color: '#2b6777' }}>
          {title}
        </Typography>
        {content && <Typography variant="body1" sx={{ color: '#2b6777', marginBottom: '30px' }}>{content}</Typography>}
        {children}
      </Container>
    </Element>
  );

  return (
    <Box sx={{ backgroundColor: '#f4f4f4' }}>
      <AppBar position="sticky" sx={{ backgroundColor: '#2b6777', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Landing Page
          </Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <ScrollLink to="section1" smooth={true} duration={500}>
              <Button sx={{ color: '#fff' }}>Section 1</Button>
            </ScrollLink>
            <ScrollLink to="section2" smooth={true} duration={500}>
              <Button sx={{ color: '#fff' }}>Section 2</Button>
            </ScrollLink>
            <ScrollLink to="section3" smooth={true} duration={500}>
              <Button sx={{ color: '#fff' }}>Section 3</Button>
            </ScrollLink>
            <ScrollLink to="section4" smooth={true} duration={500}>
              <Button sx={{ color: '#fff' }}>Section 4</Button>
            </ScrollLink>
            <Button sx={{ color: '#fff' }} onClick={handleLoginClick}>
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message="Login Successful"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <Section
        id="section1"
        title="Welcome to the Landing Page"
        content="This is the first section with a cool introduction about the landing page."
      />
      <Section id="section2" title="Leaderboard & Quote">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ color: '#2b6777', fontStyle: 'italic' }}>
                "The future belongs to those who believe in the beauty of their dreams."
              </Typography>
              <Typography variant="body1" sx={{ color: '#2b6777', marginTop: '20px' }}>
                This section contains a leaderboard image and a motivational quote on the left side.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <img 
              src="https://via.placeholder.com/500" 
              alt="Leaderboard"
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Grid>
        </Grid>
      </Section>
      <Section id="section3" title="What We Offer">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: '#2b6777', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Personalized Services</Typography>
              <Typography variant="body1" sx={{ color: '#fff', marginTop: '10px' }}>We tailor our services to meet individual client needs.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: '#2b6777', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Innovation</Typography>
              <Typography variant="body1" sx={{ color: '#fff', marginTop: '10px' }}>We drive innovation in everything we do.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: '#2b6777', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Customer Support</Typography>
              <Typography variant="body1" sx={{ color: '#fff', marginTop: '10px' }}>We provide 24/7 support for our clients.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Section>
      <Section id="section4" title="What Clients Need">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: '#2b6777', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>High-Quality Products</Typography>
              <Typography variant="body1" sx={{ color: '#fff', marginTop: '10px' }}>Our clients always need top-notch products.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: '#2b6777', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Efficient Solutions</Typography>
              <Typography variant="body1" sx={{ color: '#fff', marginTop: '10px' }}>We provide efficient and scalable solutions for all clients.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: '#2b6777', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>Dedicated Support</Typography>
              <Typography variant="body1" sx={{ color: '#fff', marginTop: '10px' }}>Our clients need ongoing, personalized support.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Section>
    </Box>
  );
};

export default LandingPage;
