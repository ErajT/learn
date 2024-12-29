const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const userRouter = require('./api/users/user.router');
const LeaderboardRouter = require('./Routes/LeaderboardRoutes');
const AdminRouter = require('./Routes/AdminRoutes');

let app = express();

// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Adjust the origin as needed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cors({
  origin: 'https://a887-116-90-103-244.ngrok-free.app', // Allow requests from frontend application
  credentials: true // Allow credentials (cookies) to be included with requests
}));

app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));


//middleware for request body
app.use(express.json());
app.use('/users', userRouter);
app.use('/leaderboard', LeaderboardRouter);
app.use('/admin', AdminRouter);

const cron = require('node-cron');
const axios = require('axios');

cron.schedule('30 15 * * 5', async () => {
  try {
    const response = await axios.post('http://localhost:2000/leaderboard/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

cron.schedule('30 18 * * 5', async () => {
  try {
    const response = await axios.post('http://localhost:2000/leaderboard/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

cron.schedule('30 20 * * 5', async () => {
  try {
    const response = await axios.post('http://localhost:2000/leaderboard/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

cron.schedule('30 22 * * 5', async () => {
  try {
    const response = await axios.post('http://localhost:2000/leaderboard/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

cron.schedule("49 22 * * 0", async () => {
  console.log("Cron job triggered on Sunday at 3 PM");

  try {

    await axios.get("http://localhost:2000/leaderboard/subscribe");

    console.log("Push notification triggered successfully.");
  } catch (error) {
    console.error("Error triggering push notification:", error.message);
  }
});

module.exports = app;