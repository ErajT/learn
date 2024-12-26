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

module.exports = router