// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
// import { Visibility } from "@mui/icons-material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { CssBaseline } from "@mui/material";

// const theme = createTheme({
//   typography: {
//     fontFamily: "Anaheim, Arial, sans-serif",
//   },
// });

// // Inject @font-face rule
// const GlobalStyles = styled("style")(() => ({
//   "@font-face": {
//     fontFamily: "Anaheim",
//     src: "url('/Anaheim.ttf') format('truetype')",
//   },
// }));

// const Container = styled.div`
//   padding: 0;
//   margin: 0 auto;
// `;

// const UserInfoBox = styled.div`
//   background: url('/back.png') no-repeat center center;
//   background-size: cover;
//   padding: 40px;
//   border-radius: 10px;
//   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
//   width: 90vw;
//   margin-top: 20px;
//   display: flex;
//   align-items: center;
//   gap: 40px;
//   height: 250px;

//   @media (max-width: 1000px) {
//     background: url('/back1.png') no-repeat center center;
//     background-size: cover;
//     flex-direction: column;
//     width: 85vw;
//     padding: 20px;
//     height: auto; /* Adjust height dynamically */
//   }

//   @media (max-width: 768px) {
//     gap: 20px; /* Reduce gap for smaller screens */
//     width: 75vw;
//     padding: 15px;
//   }
// `;


// const UserInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   gap: 2px;
//   color: #fff;
//   padding: 20px;

//   h2 {
//     margin: 10px;
//     font-size: 2rem;
//     font-weight: bold;
//   }
//   p {
//     margin: 10px;
//     font-size: 1.5rem;
//   }

//   @media (max-width: 768px) {
//     h2 {
//       font-size: 1.3rem;
//     }
//     p {
//       font-size: 1.3rem;
//     }
//   }
// `;

// const StyledCard = styled(Card)`
//   border-radius: 24px !important; /* Increased radius for smoother corners */
//   background: linear-gradient(to right, #e1eef6, #ffffff); /* Gradient for normal state */
//   padding: 16px; /* Inner padding for better spacing */
//   box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Subtle shadow for depth */
//   transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; /* Smooth transitions */

//   &:hover {
//     transform: translateY(-10px); /* Slightly more elevation on hover */
//     box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
//     background: linear-gradient(to right, #e1eef6, #ffffff); /* Keep the gradient consistent */
//   }
// `;


// const HomePage = () => {
  // const backendUrl = "http://localhost:2000";  // Use this in API calls

  // const [traineeDetails, setTraineeDetails] = useState({
  //   name: "",
  //   trainingName: "",
  //   companyName: "",
  // });
  // const [materials, setMaterials] = useState([]);

  // useEffect(() => {
  //   const fetchDataAndSubscribe = async () => {
  //     // Fetch trainee details
  //     const traineeDetailsCookie = Cookies.get("traineeDetails");
  //     if (traineeDetailsCookie) {
  //       const parsedDetails = JSON.parse(traineeDetailsCookie);
  //       console.log(parsedDetails);
  //       setTraineeDetails({
  //         name: parsedDetails.Name || "",
  //         trainingName: parsedDetails.TrainingName || "",
  //         companyName: parsedDetails.CompanyName || "",
  //       });
  //     }
  
  //     // Fetch training materials
  //     const trainingID = JSON.parse(traineeDetailsCookie)?.TrainingID;
  //     if (trainingID) {
  //       try {
  //         const response = await axios.get(`${backendUrl}/admin/getMaterial/${trainingID}`);
  //         if (response.data.status === "success") {
  //           setMaterials(response.data.materials);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching materials:", error);
  //       }
  //     }
  
  //     // Subscribe for push notifications
  //     if ("serviceWorker" in navigator) {
  //       console.log("called");
  //       await subscribeForPushNotifications(JSON.parse(traineeDetailsCookie)?.TraineeID);
  //     }
  //   };
  
  //   fetchDataAndSubscribe();
  // }, []);
  


  // const handleViewFile = (base64File) => {
  //   const byteCharacters = atob(base64File);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     byteArrays.push(new Uint8Array(byteNumbers));
  //   }

  //   const blob = new Blob(byteArrays, { type: 'application/pdf' });
  //   const blobURL = URL.createObjectURL(blob);
  //   window.open(blobURL, '_blank');
  // };

  // async function subscribeForPushNotifications(traineeID) {
  //   try {
  //     console.log(traineeID);
  //     console.log("Registering service worker...");
  //     const register = await navigator.serviceWorker.register("/worker.js", {
  //       scope: "/",
  //     });
  //     console.log("Service Worker Registered...");
  
  //     console.log("Subscribing to push notifications...");
  //     const subscription = await register.pushManager.subscribe({
  //       userVisibleOnly: true,
  //       applicationServerKey: urlBase64ToUint8Array(
  //         "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo"
  //       ),
  //     });
  
  //     console.log("Subscription successful!", subscription);
  
  //     // Send subscription to backend
  //     const response = await axios.post(`${backendUrl}/leaderboard/saveSubscription`, {
  //       "subscription": subscription,
  //       "traineeID": traineeID
  //     });
  //     // await axios.post("/api/subscribe", subscription);
  //     console.log("Subscription object sent to backend.");
  //   } catch (error) {
  //     console.error("Failed to subscribe for push notifications:", error);
  //   }
  // }
  
  // function urlBase64ToUint8Array(base64String) {
  //   const padding = "=".repeat((4 - base64String.length % 4) % 4);
  //   const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);
  
  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputArray;
  // }

//   return (
    // <Container>
    //   <UserInfoBox>
    //     <UserInfo>
    //       <p>
    //         <label>Participant's Name:</label> {traineeDetails.name}
    //       </p>
    //       <p>
    //         <label>Training Name:</label> {traineeDetails.trainingName}
    //       </p>
    //       <p>
    //         <label>Company Name:</label> {traineeDetails.companyName}
    //       </p>
    //     </UserInfo>
    //   </UserInfoBox>

    //   <Grid container spacing={4} style={{ marginTop: "40px", textAlign: "center"}}>
    //   {materials.length > 0 ? (
    //     materials.map((material, index) => (
    //       <Grid item xs={12} sm={6} md={4} key={index}>
    //         <StyledCard elevation={3} style={{background: "linear-gradient(to right, #e1eef6, #ffffff)" }}>
    //           <CardContent style={{background: "linear-gradient(to right, #e1eef6, #ffffff)" }}>
    //             <Typography
    //               variant="h5"
    //               // gutterBottom
    //               style={{
    //                 fontWeight: "bold",
    //                 textAlign: "center",
    //                 color: "#2b6777", 
    //                 /* Darker color for better readability */
    //               }}
    //             >
    //               Title:{material.Title}
    //             </Typography>
    //             <Typography
    //               variant="body1"
    //               // color="textSecondary"
    //               paragraph
    //               style={{
    //                 textAlign: "justify",
    //                 marginBottom: "16px",
    //                 lineHeight: 1.6, /* Better line spacing */
    //                 color:"#2b6777",
    //                 fontWeight:"bold",
    //                 paddingBottom:"15px"
    //               }}
    //             >
    //               Description:{material.Description}
    //             </Typography>
    //             <Button
    //               variant="contained"
    //               style={{
    //                 backgroundColor: "#2b6777",
    //                 color: "#fff",
    //                 textTransform: "capitalize",
    //                 fontWeight: "bold",
    //                 borderRadius: "20px",
    //                 padding: "8px 16px",
    //               }}
    //               startIcon={<Visibility style={{ color: "#fff" }} />}
    //               onClick={() => handleViewFile(material.File)}
    //             >
    //               View File
    //             </Button>
    //           </CardContent>
    //         </StyledCard>
    //       </Grid>
    //     ))
    //   ) : (

    //       <Grid item xs={12}>
    //         <Typography variant="body1" color="textSecondary">
    //           No materials available for this training.
    //         </Typography>
    //       </Grid>
    //     )}
    //   </Grid>
    // </Container>
//   );
// };

// export default HomePage;



import React, { useEffect,useState } from "react";
import styled from "styled-components"; 
import Cookies from "js-cookie";
import { IconButton, CircularProgress } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { backendUrl } from "./constants";

import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";


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

const Container = styled.div`
  padding: 0;
  margin: 0 auto;
`;

const UserInfoBox = styled.div`
  background: url('/back.png') no-repeat center center;
  background-size: cover;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 90vw;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 40px;
  height: 250px;

  @media (max-width: 1000px) {
    background: url('/back1.png') no-repeat center center;
    background-size: cover;
    flex-direction: column;
    width: 85vw;
    padding: 20px;
    height: auto; /* Adjust height dynamically */
  }

  @media (max-width: 768px) {
    gap: 20px; /* Reduce gap for smaller screens */
    width: 75vw;
    padding: 15px;
  }
`;


const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  color: #fff;
  padding: 20px;

  h2 {
    margin: 10px;
    font-size: 2rem;
    font-weight: bold;
  }
  p {
    margin: 10px;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.3rem;
    }
    p {
      font-size: 1.3rem;
    }
  }
`;

const StyledCard = styled(Card)`
  border-radius: 24px !important; 
  background: linear-gradient(to right, #e1eef6, #ffffff); 
  padding: 16px; 
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); 
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; 

  &:hover {
    transform: translateY(-10px); 
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to right, #e1eef6, #ffffff); 
  }
`;


const ChatBotButton = styled(IconButton)`
  position: fixed;
  bottom: -2vh; /* 2% of the viewport height */
  right: -85vw; /* 2% of the viewport width */
  background-color: #2b6777 !important;
  color: #fff !important;
  width: 4vw; /* 5% of the viewport width */
  height: 4vw; /* Ensures the button is square */
  border-radius: 50%; /* Makes the button circular */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Professional shadow */
  z-index: 9999;

  @media (max-width: 1024px) {
    bottom: -2vh; /* Slightly larger margin for smaller screens */
    right: -75vw;
    width: 8vw; /* Increase button size slightly */
    height: 8vw;
  }

  @media (max-width: 768px) {
    bottom: -2vh;
    right: -70vw;
    width: 10vw; /* Larger button for smaller screens */
    height: 10vw;
  }

  @media (max-width: 480px) {
    bottom: -2vh;
    right: -56vw;
    width: 15vw; /* Even larger button for very small screens */
    height: 15vw;
  }

  &:hover {
    background-color: #3a7991 !important; /* Subtle color change on hover */
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 80px; 
  right: 20px; 
  width: 350px;
  max-height: 400px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 9999; 
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 300px;
  }

  @media (max-width: 480px) {
    width: 280px; 
  }
`;
const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #2b6777;
  color: #fff;
  font-weight: bold;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f4f4f4;
`;
const ChatInput = styled.div`
  display: flex;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #ddd;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
  }

  button {
    background-color: #2b6777;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;

    &:hover {
      background-color: #3a7991;
    }
  }
`;
const ChatInputField = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
`;
const ChatSendButton = styled.button`
  background: #2b6777;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
`;


const HomePage = () => {
  // const backendUrl = process.env.BACKEND_URL; 
    const tok = Cookies.get("token");
    const token = JSON.parse(tok);
    const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const backendUrl = "http://localhost:2000";  

  const [traineeDetails, setTraineeDetails] = useState({
    name: "",
    trainingName: "",
    companyName: "",
  });
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchDataAndSubscribe = async () => {
      // Fetch trainee details
      const traineeDetailsCookie = Cookies.get("traineeDetails");
      if (traineeDetailsCookie) {
        const parsedDetails = JSON.parse(traineeDetailsCookie);
        // console.log(parsedDetails);
        setTraineeDetails({
          name: parsedDetails.Name || "",
          trainingName: parsedDetails.TrainingName || "",
          companyName: parsedDetails.CompanyName || "",
          // TraineeID: parsedDetails.TraineeID || "",

        });
        // console.log("ggf",TraineeID);
      }
  
      // Fetch training materials
      const trainingID = JSON.parse(traineeDetailsCookie)?.TrainingID;
      if (trainingID) {
        try {
          const response = await axios.get(`${backendUrl}/admin/getMaterial/${trainingID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          if (response.data.status === "success") {
            setMaterials(response.data.materials);
          }
        } catch (error) {
          console.error("Error fetching materials:", error);
        }
      }
  
      // Subscribe for push notifications
      if ("serviceWorker" in navigator) {
        // console.log("called");
        await subscribeForPushNotifications(JSON.parse(traineeDetailsCookie)?.TraineeID);
      }
    };
  
    fetchDataAndSubscribe();
  }, []);
  


  const handleViewFile = (base64File) => {
    const byteCharacters = atob(base64File);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, '_blank');
  };

  async function subscribeForPushNotifications(traineeID) {
    try {
      // console.log(traineeID);
      console.log("Registering service worker...");
      const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/",
      });
      console.log("Service Worker Registered...");
  
      console.log("Subscribing to push notifications...");
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo"
        ),
      });
  
      console.log("Subscription successful!", subscription);
  
      // Send subscription to backend
      const response = await axios.post(`${backendUrl}/leaderboard/saveSubscription`, {
        "subscription": subscription,
        "traineeID": traineeID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // await axios.post("/api/subscribe", subscription);
      console.log("Subscription object sent to backend.");
    } catch (error) {
      console.error("Failed to subscribe for push notifications:", error);
    }
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  const fetchTraineeAndTrainingDetails = () => {
    const traineeDetailsCookie = Cookies.get("traineeDetails");

    if (traineeDetailsCookie) {
      try {
        const parsedDetails = JSON.parse(traineeDetailsCookie);
        const traineeID = parsedDetails.TraineeID || null;
        const trainingID = parsedDetails.TrainingID || null;
        return { traineeID, trainingID };
      } catch (error) {
        console.error("Error parsing traineeDetails cookie:", error);
        return { traineeID: null, trainingID: null };
      }
    }
    console.error("Trainee details cookie not found.");
    return { traineeID: null, trainingID: null };
  };


  const toggleChatWindow = async () => {
    setIsChatOpen(!isChatOpen);
  
    if (!isChatOpen) {
      const { traineeID } = fetchTraineeAndTrainingDetails();
  
      if (traineeID) {
        try {
          const response = await axios.get(
            `${backendUrl}/admin/getChat/${traineeID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
  
          if (response.data?.status === "success") {
            const chatData = response.data?.data;
  
            if (Array.isArray(chatData) && chatData.length > 0) {
              setMessages(
                chatData.map((chat) => ({
                  text: chat.ChatDetails, // Use 'ChatDetails' for chat content
                  sender: chat.ByTrainee ? "user" : "bot", // Determine sender
                }))
              );
            } else {
              // Display message in the chat window if no previous chats exist
              setMessages([{ text: "No previous chats found.", sender: "bot" }]);
            }
          } else {
            console.warn(response.data?.message || "Unexpected response format.");
            setMessages([{ text: response.data?.message || "Unable to fetch chats.", sender: "bot" }]);
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
          setMessages([{ text: "Failed to load chats. Please try again later.", sender: "bot" }]);
        }
      } else {
        setMessages([{ text: "Trainee ID not found. Unable to fetch chats.", sender: "bot" }]);
      }
    }
  };
  
  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { traineeID, trainingID } = fetchTraineeAndTrainingDetails();

    if (!traineeID || !trainingID) {
      console.error("Trainee ID or Training ID not found in cookies.");
      return;
    }

    const messageData = {
      TraineeID: traineeID,
      TrainingID: trainingID,
      Message: newMessage,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, sender: "user" },
    ]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/leaderboard/sendChat`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Message sent successfully!", sender: "bot" },
        ]);
      } else {
        console.error("Error sending message:", response.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Failed to send message.", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Failed to send message.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  

  return (
    <>
    <Container>
      <UserInfoBox>
        <UserInfo>
          <p>
            <label>Participant:</label> {traineeDetails.name}
          </p>
          <p>
            <label>Training:</label> {traineeDetails.trainingName}
          </p>
          <p>
            <label>Company:</label> {traineeDetails.companyName}
          </p>
        </UserInfo>
      </UserInfoBox>

      <Grid container spacing={4} style={{ marginTop: "40px", textAlign: "center"}}>
      {materials.length > 0 ? (
        materials.map((material, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard elevation={3} style={{background: "linear-gradient(to right, #e1eef6, #ffffff)" }}>
              <CardContent style={{background: "linear-gradient(to right, #e1eef6, #ffffff)" }}>
                <Typography
                  variant="h5"
                  // gutterBottom
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#2b6777", 
                    /* Darker color for better readability */
                  }}
                >
                  Title:{material.Title}
                </Typography>
                <Typography
                  variant="body1"
                  // color="textSecondary"
                  paragraph
                  style={{
                    textAlign: "justify",
                    marginBottom: "16px",
                    lineHeight: 1.6, 
                    color:"#2b6777",
                    fontWeight:"bold",
                    paddingBottom:"15px"
                  }}
                >
                  Description:{material.Description}
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#2b6777",
                    color: "#fff",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    padding: "8px 16px",
                  }}
                  startIcon={<Visibility style={{ color: "#fff" }} />}
                  onClick={() => handleViewFile(material.File)}
                >
                  View File
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))
      ) : (

          <Grid item xs={12}>
            <Typography variant="body1" color="textSecondary">
              No materials available for this training.
            </Typography>
          </Grid>
        )}
      </Grid>
      <ChatBotButton onClick={toggleChatWindow}>
        <ChatIcon fontSize="large" />
      </ChatBotButton>
      {isChatOpen && (
        <ChatWindow>
          <ChatHeader>
            Chat with Us
            <button onClick={toggleChatWindow} style={{ color: "#2b6777" }}>
              <CloseIcon />
            </button>
          </ChatHeader>
          <ChatBody>
  {messages.map((msg, index) => (
    <p
      key={index}
      style={{
        textAlign: msg.sender === "user" ? "right" : "left",
        background: msg.sender === "user" ? "#2b6777" : "#ddd",
        color: msg.sender === "user" ? "#fff" : "#000",
        padding: "8px",
        borderRadius: "10px",
        marginBottom: "10px",
        maxWidth: "80%",
        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
      }}
    >
      {msg.text}
    </p>
  ))}
  {isLoading && (
    <div style={{ textAlign: "center", margin: "10px 0" }}>
      <CircularProgress size={20} />
    </div>
  )}
</ChatBody>
          <ChatInput>
            <ChatInputField
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleInputChange}
            />
            <ChatSendButton onClick={handleSendMessage}>Send</ChatSendButton>
          </ChatInput>
        </ChatWindow>
      )}
    </Container>
   
      
    </>
  );
};

export default HomePage;
