import React, { useState } from 'react';
import { Container, Box, Typography, Select, MenuItem, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Anaheim, Arial, sans-serif",
  },
});

const ChatContainer = styled(Box)({
  width: '100%',
  maxWidth: '600px',
  margin: '20px auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  overflowY: 'auto',
  maxHeight: '400px',
});

const ChatBubble = styled(Box)(({ isUser }) => ({
  maxWidth: '80%',
  margin: isUser ? '10px 0 10px auto' : '10px 0 10px 0',
  padding: '12px',
  borderRadius: '20px',
  backgroundColor: isUser ? '#f0f0f0' : '#2b6777',
  color: isUser ? '#333' : '#fff',
  fontSize: '14px',
  fontWeight: '400',
  wordWrap: 'break-word',
}));

const SendButton = styled(Button)({
  backgroundColor: '#2b6777',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#3a7991',
  },
  borderRadius: '25px',
  textTransform: 'none',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: '600',
});

const SelectTrainee = styled(Select)({
  width: '100%',
  maxWidth: '250px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
});

const TraineeChatPage = () => {
  const [selectedTrainee, setSelectedTrainee] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const trainees = [
    { name: 'John Doe', messages: [{ sender: 'trainee', text: 'Hello, I need help with my training.' }] },
    { name: 'Jane Smith', messages: [{ sender: 'trainee', text: 'I have a question regarding the schedule.' }] },
    { name: 'Sam Wilson', messages: [{ sender: 'trainee', text: 'Can you explain the training modules?' }] },
  ];

  const handleTraineeChange = (event) => {
    const traineeName = event.target.value;
    setSelectedTrainee(traineeName);
    const trainee = trainees.find((t) => t.name === traineeName);
    setMessageHistory(trainee ? trainee.messages : []);
  };

  const handleMessageSend = () => {
    if (newMessage.trim()) {
      setMessageHistory([...messageHistory, { sender: 'user', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography 
          variant="h3" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontWeight: '700', 
            paddingTop: '40px',
            color: '#2b6777',
          }}
        >
          Trainee Query Chat
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
          <SelectTrainee
            value={selectedTrainee}
            onChange={handleTraineeChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Select a Trainee</MenuItem>
            {trainees.map((trainee, index) => (
              <MenuItem key={index} value={trainee.name}>
                {trainee.name}
              </MenuItem>
            ))}
          </SelectTrainee>
        </Box>

        {selectedTrainee && (
          <>
            <ChatContainer>
              {messageHistory.map((msg, index) => (
                <ChatBubble key={index} isUser={msg.sender === 'user'}>
                  {msg.text}
                </ChatBubble>
              ))}
            </ChatContainer>

            <Box sx={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <TextField
                variant="outlined"
                fullWidth
                label="Your Reply"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />
              <SendButton
                variant="contained"
                onClick={handleMessageSend}
                sx={{ height: '100%' }}
              >
                Send
              </SendButton>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default TraineeChatPage;