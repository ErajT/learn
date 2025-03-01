import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Select, MenuItem, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
// import Cookies from 'js-cookie';
import { backendUrl } from "./constants";
import Cookies from "js-cookie";

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
  backgroundColor: isUser ?'#2b6777': '#d8d8d7',
  color: isUser ? '#fff' : '#333',
  fontSize: '14px',
  fontWeight: '400',
  wordWrap: 'break-word',
}));

const SendButton1= styled(Button)({
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
  const tok = Cookies.get("token");
  const token = JSON.parse(tok);
  const [selectedTrainee, setSelectedTrainee] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [trainees, setTrainees] = useState([]);


  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const selectedTraining = Cookies.get('selectedTraining');
        
        if (selectedTraining) {
          const parsedTraining = JSON.parse(selectedTraining);
          const trainingId = parsedTraining.trainingID;
          // console.log(parsedTraining);

          // Call the API using the trainingId
          const response = await fetch(`${backendUrl}/admin/getTraineesForChat/${trainingId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          const result = await response.json();

          if (result.status === 'success') {
            const updatedTrainees = result.data.map(trainee => ({
              name: trainee.Name,
              id: trainee.TraineeID,
              messages: [],
            }));

            setTrainees(updatedTrainees);
          }
        } else {
          console.error('No selectedTraining cookie found');
        }
      } catch (error) {
        console.error('Error fetching trainees:', error);
      }
    };

    fetchTrainees();
  }, []);

  const handleTraineeChange = async (event) => {
    const traineeName = event.target.value;
    setSelectedTrainee(traineeName);
    const trainee = trainees.find((t) => t.name === traineeName);
  
    if (trainee) {
      try {
        // Fetch the chat messages using the trainee's ID
        const response = await fetch(`${backendUrl}/admin/getChat/${trainee.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        const result = await response.json();
  
        if (result.status === 'success') {
          const formattedMessages = result.data.map((chat) => {
            const sender = chat.ByTrainee === 1 ? 'trainee' : 'admin';
            return { sender, text: chat.ChatDetails };
          });
          setMessageHistory(formattedMessages);
        } else {
          console.error('Failed to fetch messages:', result.message || 'Unknown error');
          setMessageHistory([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessageHistory([]);
      }
    } else {
      setMessageHistory([]);
    }
  };
  
  

  const handleMessageSend = async () => {
    if (newMessage.trim()) {
      const trainee = trainees.find((t) => t.name === selectedTrainee);

      const selectedTraining = Cookies.get('selectedTraining');
          const parsedTraining = JSON.parse(selectedTraining);
          const trainingId = parsedTraining.trainingID;
        
  
      if (trainee) {
        try {
          const requestBody = {
            TrainingID: trainingId,
            TraineeID: trainee.id,
            Message: newMessage.trim(),
          };
  
          // Send the message to the API
          const response = await fetch(`${backendUrl}/admin/sendChat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(requestBody),
          });
  
          const result = await response.json();
  
          if (result.status === 'success') {
            setMessageHistory([...messageHistory, { sender: 'admin', text: newMessage }]);
            setNewMessage('');
          } else {
            console.error('Failed to send message:', result.message || 'Unknown error');
          }
        
        } catch (error) {
          console.error('Error sending message:', error);
        }
      } else {
        console.error('No trainee selected');
      }
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
        Query Chat
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
          <SelectTrainee
            value={selectedTrainee}
            onChange={handleTraineeChange}
            displayEmpty
          >
            <MenuItem value="" disabled>Select a Participant</MenuItem>
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
                <ChatBubble key={index} isUser={msg.sender === 'trainee'}>
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
              <SendButton1
                variant="contained"
                onClick={handleMessageSend}
                sx={{ height: '100%' }}
              >
                Send
              </SendButton1>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default TraineeChatPage;