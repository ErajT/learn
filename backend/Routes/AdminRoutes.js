const AdminHandler = require('../Controllers/AdminControllers')
const express= require('express')
const multer = require('multer');

const router = express.Router();

router.route('/addTraining')
    .post(AdminHandler.addTraining);

router.route("/saveTrainee")
    .post(AdminHandler.addTrainee);

router.route("/saveAllTrainees")
    .post(AdminHandler.addManyTrainees);

router.route("/getAllLeaderboards/:TrainingID")
    .get(AdminHandler.getAllLeaderboards);

router.route("/getAllTrainings")
    .get(AdminHandler.getAllTrainings);

router.route("/getTraineesForTraining/:TrainingID")
    .get(AdminHandler.getTraineesForTraining);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/addMaterial')
    .post(upload.single('material'), AdminHandler.addMaterial);  
 
router.route('/getMaterial/:TrainingID')
    .get(AdminHandler.getMaterials);

router.route('/getweeks/:TrainingID')
    .get(AdminHandler.getweeks);

router.route('/getFullLeaderboard/:TrainingID/:WeekNumber')
    .get(AdminHandler.getFullLeaderboard);

router.route('/getSubmissionsBasedOnDate/:TrainingID/:TraineeID/:Date')
    .get(AdminHandler.getSubmissionsBasedOnDate);

router.route('/getAllTraineesForTraining/:TrainingID')
    .get(AdminHandler.getTraineesForTraining1);

router.route('/approve')
    .post(AdminHandler.approve);

    router.route('/disapprove')
    .post(AdminHandler.disapprove);

router.route('/getSubmissionsOfTrainee/:TrainingID/:TraineeID')
    .get(AdminHandler.getSubmissionsOfTrainee);

router.route('/deleteMaterial/:TrainingID/:MaterialNumber')
    .get(AdminHandler.deleteMaterial);

router.route('/sendChat')
    .post(AdminHandler.sendChat);

router.route('/getTraineesForChat/:t_id')
    .get(AdminHandler.getTraineesForTraining2);

router.route('/getChat/:TraineeID')
    .get(AdminHandler.getChat);

router.route('/disallowLogin')
    .post(AdminHandler.disallow);

module.exports = router