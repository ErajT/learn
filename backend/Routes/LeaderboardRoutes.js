const LeaderboardHandler = require('../Controllers/LeaderboardControllers')
const express= require('express')
const multer = require('multer');

const router = express.Router();

router.route('/getTraineeDetails/:id')
    .get(LeaderboardHandler.getTraineeDetails);

router.route('/example')
    .post(LeaderboardHandler.Example);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/photo')
    .post(upload.single('photo'), LeaderboardHandler.Photo);
    

router.route('/getAllTraineesForTraining/:id')
    .get(LeaderboardHandler.getTraineesForTraining);

router.route('/Refer')
    .post(LeaderboardHandler.Refer);

router.route('/generate')
    .post(LeaderboardHandler.generateLeaderboard)

router.route("/getTopThree/:TrainingID")
    .get(LeaderboardHandler.getTopThreeTrainees);

router.route("/getFullLeaderboard/:TrainingID")
    .get(LeaderboardHandler.getFullLeaderboard);

router.route("/getDetails/:email")
    .get(LeaderboardHandler.getDetails)

module.exports = router