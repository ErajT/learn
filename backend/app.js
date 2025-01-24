const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { checkToken } = require("./auth/token_validation")

const userRouter = require('./api/users/user.router');
const LeaderboardRouter = require('./Routes/LeaderboardRoutes');
const AdminRouter = require('./Routes/AdminRoutes');
const ScheduleRouter = require('./Routes/ScheduledRoutes');

let app = express();
app.options('*', cors()); // Allow preflight requests

// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://learn-nu-nine.vercel.app'); // Adjust the origin as needed
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); 
  next();
});

app.use(cors({
  origin: ['https://learn-nu-nine.vercel.app'], // Allow requests from frontend application
  // origin: ['https://learn-git-main-erajts-projects.vercel.app'],
  // origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true // Allow credentials (cookies) to be included with requests
}));

app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));


const corsOptions = {
  origin: ['https://learn-nu-nine.vercel.app'], // Allowed origins
  // origin: ['https://learn-git-main-erajts-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
  credentials: true // Allow credentials
};

// Global CORS middleware
// app.use(cors(corsOptions));

// Handle preflight requests explicitly for critical routes
app.options('/users', cors(corsOptions));
app.options('/leaderboard', cors(corsOptions));
app.options('/admin', cors(corsOptions));
app.options('/schedule', cors(corsOptions));

//middleware for request body
app.use(express.json());
app.use('/users', userRouter);
app.use('/leaderboard' , LeaderboardRouter);
app.use('/admin', AdminRouter);
app.use('/schedule', ScheduleRouter);

const cron = require('node-cron');
const axios = require('axios');

cron.schedule('30 15 * * 5', async () => {
  try {
    const response = await axios.post('https://backend-snowy-delta.vercel.app/schedule/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

cron.schedule('40 18 * * 5', async () => {
  try {
    const response = await axios.post('https://backend-snowy-delta.vercel.app/schedule/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

cron.schedule('30 20 * * 5', async () => {
  try {
    const response = await axios.post('https://backend-snowy-delta.vercel.app/schedule/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

cron.schedule('30 22 * * 5', async () => {
  try {
    const response = await axios.post('https://backend-snowy-delta.vercel.app/schedule/generate');

    console.log('API triggered successfully:', response.data);
  } catch (error) {
    console.error('Error triggering API:', error.message);
  }
});

app.listen(2000,()=>{
  console.log("Server has started");
})


module.exports = app;