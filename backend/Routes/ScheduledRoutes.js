const ScheduledHandler = require('../Controllers/ScheduledControllers')
const express= require('express')

const router = express.Router();

router.route('/generate')
    .post(ScheduledHandler.generateLeaderboard)

    
module.exports = router