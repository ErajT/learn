const LeaderboardHandler = require('../Controllers/LeaderboardControllers')
const express= require('express')

const router = express.Router();

router.route('/getTraineeDetails')
    .get(LeaderboardHandler.getTraineeDetails)

module.exports = router