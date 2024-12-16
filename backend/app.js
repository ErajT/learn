const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


// const userRouter = require('./api/users/user.router');
const LeaderboardRouter = require('./Routes/LeaderboardRoutes');

let app = express();

// Middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Adjust the origin as needed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from frontend application
  credentials: true // Allow credentials (cookies) to be included with requests
}));

app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));



//middleware for request body
app.use(express.json());
// app.use('/users', userRouter);
app.use('/leaderboard', LeaderboardRouter);


module.exports = app;