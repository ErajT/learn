const LeaderboardHandler = require('../Controllers/LeaderboardControllers')
const express= require('express')
const multer = require('multer');

const router = express.Router();

router.route('/getTraineeDetails/:id')
    .get(LeaderboardHandler.getTraineeDetails);

router.route('/simpleResponse')
    .post(LeaderboardHandler.simpleResponse);

router.route('/example')
    .post(LeaderboardHandler.Example);

// Set up multer storage (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route to handle photo uploads
router.route('/photo')
    .post(upload.single('photo'), LeaderboardHandler.Photo);  // Use multer middleware before your controller
    

router.route('/getAllTraineesForTraining/:id')
    .get(LeaderboardHandler.getTraineesForTraining);

router.route('/Refer')
    .post(LeaderboardHandler.Refer);

router.route('/generate')
    .post(LeaderboardHandler.generateLeaderboard)

module.exports = router