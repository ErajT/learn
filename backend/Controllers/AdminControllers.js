const Qexecution = require("./query");
const webpush = require("web-push");

const updateTraineeScore = async (TraineeID, pointsToAdd) => {
    try {
        // Query to get the current score of the trainee
        const currentScoreResult = await Qexecution.queryExecute("SELECT Score FROM trainee WHERE TraineeID = ?", [TraineeID]);
        const currentScore = currentScoreResult.length ? currentScoreResult[0].Score : 0; // Default to 0 if score is null
        
        // Calculate the new score by adding the new points to the old score
        const newScore = parseInt(currentScore || 0) + pointsToAdd;

        // console.log("new score is ", currentScore);

        // Update the trainee's score in the database
        await Qexecution.queryExecute("UPDATE Trainee SET Score = ? WHERE TraineeID = ?", [newScore, TraineeID]);

        return newScore;
    } catch (err) {
        console.error("Error updating trainee score:", err.message);
        throw new Error("Error updating trainee score");
    }
};

exports.addTraining = async (req, res) => {
    const { companyName, TrainerName, Topic, CategoryID, Description } = req.body;

    console.log(companyName, TrainerName, Topic, CategoryID, Description);

    // Queries
    const SQL_CHECK_COMPANY = "SELECT CompanyID FROM company WHERE Name = ?";
    const SQL_INSERT_COMPANY = "INSERT INTO company(Name) VALUES(?)";
    const SQL_INSERT_TRAINING = "INSERT INTO training(CompanyID, TrainerName, Topic, category, Description) VALUES(?,?,?,?,?)";

    try {
        // Check if the company exists
        const existingCompany = await Qexecution.queryExecute(SQL_CHECK_COMPANY, [companyName]);

        let companyID;
        if (existingCompany.length > 0) {
            // Company exists, get the ID
            companyID = existingCompany[0].CompanyID;
        } else {
            // Company doesn't exist, insert it
            const resultInsertCompany = await Qexecution.queryExecute(SQL_INSERT_COMPANY, [companyName]);
            companyID = resultInsertCompany.insertId; // Get the auto-incremented CompanyID
            // console.log(companyID);
        }

        // Insert training
        const resultInsertTraining = await Qexecution.queryExecute(SQL_INSERT_TRAINING, [companyID, TrainerName, Topic, CategoryID, Description]);
        const trainingID = resultInsertTraining.insertId; // Get the auto-incremented TrainingID

        res.status(200).send({
            status: "success",
            message: "Training added successfully",
            trainingID: trainingID,  // Return the TrainingID
            companyID: companyID     // Return the CompanyID
        });
    } catch (err) {
        res.status(404).send({
            status: "fail",
            message: "Error saving training",
            error: err.message,
        });
    }
};

// API to Add a Trainee
exports.addTrainee = async (req, res) => {
    const { TrainingID, CompanyID, Name, Email, PhoneNumber } = req.body;

    // Set Score to 0 if not provided
    const Score = 0;

    // Queries
    const SQL_INSERT_TRAINEE = `
        INSERT INTO trainee (CompanyID, TrainingID, Name, Email, PhoneNumber, Score, Allowed)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const SQL_GET_TRAINEE_ID = `
        SELECT TraineeID FROM trainee WHERE Email = ? AND PhoneNumber = ? ORDER BY TraineeID DESC LIMIT 1
    `;

    try {
        // Insert the new trainee into the database
        const result = await Qexecution.queryExecute(SQL_INSERT_TRAINEE, [
            CompanyID,
            TrainingID,
            Name,
            Email,
            PhoneNumber,
            Score,
            1
        ]);
        console.log("done")

        // Check if the insertion was successful
        if (result.affectedRows > 0) {
            // Get the inserted trainee's ID
            const [traineeRecord] = await Qexecution.queryExecute(SQL_GET_TRAINEE_ID, [Email, PhoneNumber]);
            const traineeID = traineeRecord?.TraineeID;

            res.status(200).send({
                status: "success",
                message: "Trainee added successfully.",
                data: traineeID, // Return the ID
            });
        } else {
            res.status(500).send({
                status: "fail",
                message: "Error saving the trainee.",
            });
        }
    } catch (err) {
        res.status(500).send({
            status: "fail",
            message: "Error saving the trainee.",
            error: err.message,
        });
    }
};

// API to Insert Many Trainees
exports.addManyTrainees = async (req, res) => {
    const { TrainingID, CompanyID, trainees } = req.body; // Array of trainees to be inserted

    if (!Array.isArray(trainees) || trainees.length === 0) {
        return res.status(400).send({
            status: "fail",
            message: "No trainees data provided or invalid format.",
        });
    }

    // SQL Query to Insert Multiple Trainees
    const SQL_INSERT_MANY_TRAINEES = `
        INSERT INTO trainee (CompanyID, TrainingID, Name, Email, PhoneNumber, Score, Allowed)
        VALUES ?
    `;
    const SQL_GET_TRAINEE_IDS = `
        SELECT TraineeID FROM trainee WHERE Email IN (?) AND PhoneNumber IN (?) ORDER BY TraineeID ASC
    `;

    // Prepare the values to insert in the proper format for batch insertion
    const values = trainees.map(trainee => [
        CompanyID,        // Same CompanyID for all
        TrainingID,       // Same TrainingID for all
        trainee.Name,
        trainee.Email,
        trainee.PhoneNumber,
        0, // Default Score to 0
        1
    ]);
    const emails = trainees.map(trainee => trainee.Email);
    const phoneNumbers = trainees.map(trainee => trainee.PhoneNumber);

    try {
        // Execute the batch insert
        const result = await Qexecution.queryExecute(SQL_INSERT_MANY_TRAINEES, [values]);

        // Check if the insertion was successful
        if (result.affectedRows > 0) {
            // Get the inserted trainee IDs
            const traineeRecords = await Qexecution.queryExecute(SQL_GET_TRAINEE_IDS, [emails, phoneNumbers]);
            const traineeIDs = traineeRecords.map(record => record.TraineeID);

            res.status(200).send({
                status: "success",
                message: `${result.affectedRows} trainees added successfully.`,
                data: traineeIDs, // Return the IDs
            });
        } else {
            res.status(500).send({
                status: "fail",
                message: "Error saving the trainees.",
            });
        }
    } catch (err) {
        res.status(500).send({
            status: "fail",
            message: "Error saving the trainees.",
            error: err.message,
        });
    }
};

// API to Get All Leaderboards for a Particular Training
exports.getAllLeaderboards = async (req, res) => {
    const { TrainingID } = req.params; // Assuming TrainingID is passed as a URL parameter

    const getAllLeaderboardsSQL = `
        SELECT LeaderboardID, WeekDates, Ranking, Score, WeekNumber
        FROM leaderboard
        WHERE TrainingID = ?
        ORDER BY LeaderboardID DESC
    `;

    try {
        // Get all leaderboards for the given TrainingID
        const leaderboards = await Qexecution.queryExecute(getAllLeaderboardsSQL, [TrainingID]);

        if (!leaderboards.length) {
            return res.status(404).send({
                status: "fail",
                message: "No leaderboards found for the given training.",
            });
        }

        // Prepare the response
        const allLeaderboards = [];

        // Iterate through the leaderboards using a for loop (for async/await compatibility)
        for (let leaderboard of leaderboards) {
            const { LeaderboardID, WeekDates, Ranking, Score, WeekNumber } = leaderboard;

            // Split the comma-separated lists of trainee IDs and scores
            const rankingList = Ranking.split(", ");
            const scoreList = Score.split(", ");

            const leaderboardDetails = [];

            // Iterate through the trainees in the ranking and score lists
            for (let i = 0; i < rankingList.length; i++) {
                const traineeID = rankingList[i];
                const score = scoreList[i];

                // Get the name of the trainee
                const getTraineeSQL = `SELECT Name FROM trainee WHERE TraineeID = ? AND TrainingID = ?`;
                const trainee = await Qexecution.queryExecute(getTraineeSQL, [traineeID, TrainingID]);

                if (trainee.length) {
                    leaderboardDetails.push({
                        Name: trainee[0].Name,
                        Score: score, // Use the score from the leaderboard
                    });
                }
            }

            allLeaderboards.push({
                LeaderboardID,
                WeekDates,
                WeekNumber,
                leaderboardDetails
            });
        }

        res.status(200).send({
            status: "success",
            message: "All leaderboards fetched successfully.",
            allLeaderboards,
        });
    } catch (err) {
        console.error("Error fetching leaderboards:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error fetching leaderboards.",
            error: err.message,
        });
    }
};

// API to Get All Trainings with Company Name
exports.getAllTrainings = async (req, res) => {
    const getAllTrainingsSQL = `
        SELECT t.TrainingID, t.CompanyID, t.TrainerName, t.Topic, t.Description, c.Name AS CompanyName
        FROM training t
        JOIN company c ON t.CompanyID = c.CompanyID
    `;

    try {
        // Get all trainings with company names
        const trainings = await Qexecution.queryExecute(getAllTrainingsSQL);

        if (trainings.length === 0) {
            return res.status(404).send({
                status: "fail",
                message: "No trainings found.",
            });
        }

        res.status(200).send({
            status: "success",
            message: "All trainings fetched successfully.",
            trainings,
        });
    } catch (err) {
        console.error("Error fetching trainings:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error fetching trainings.",
            error: err.message,
        });
    }
};

exports.getTraineesForTraining = async (req, res) => {
    // Query to join Training and Trainee tables and fetch Trainees
    const SQL = "SELECT * FROM trainee WHERE TrainingID = ? AND Allowed = 1";

    try {
        const { TrainingID } = req.params; // Get TrainingID from request params

        // Execute the JOIN query
        const result = await Qexecution.queryExecute(SQL, [TrainingID]);

        if (result.length === 0) {
            return res.status(200).send({
                status: "success",
                message: "No trainees found for this training",
            });
        }

        // Success response with trainee data
        res.status(200).send({
            status: "success",
            data: result, // List of TraineeID and Name
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error retrieving trainees",
            error: err.message,
        });
    }
};

// API to Add Material for a Training
exports.addMaterial = async (req, res) => {
    const { TrainingID, Title, Description } = req.body; // Expecting TrainingID, Title, Description
    const Material = req.file; // The file uploaded (should be a PDF, PPT, image, etc.)

    // Check if Material exists in the request

    // console.log(TrainingID, Title, Description);
    if (!Material) {
        return res.status(400).send({
            status: "fail",
            message: "No material uploaded. Please upload a valid file.",
        });
    }

    // SQL Query to Check if a record for the given TrainingID exists in the Material table
    const checkMaterialSQL = "SELECT * FROM material WHERE TrainingID = ?";

    // Prepare the column names for materials
    const materialColumns = ['M1_File', 'M2_File', 'M3_File', 'M4_File', 'M5_File', 'M6_File'];
    const titleColumns = ['M1_Title', 'M2_Title', 'M3_Title', 'M4_Title', 'M5_Title', 'M6_Title'];
    const descColumns = ['M1_Description', 'M2_Description', 'M3_Description', 'M4_Description', 'M5_Description', 'M6_Description'];

    try {
        // Check if there is already a material record for the given TrainingID
        const existingMaterial = await Qexecution.queryExecute(checkMaterialSQL, [TrainingID]);

        // If no record exists, create a new record and store the material
        if (existingMaterial.length === 0) {
            const insertMaterialSQL = `
                INSERT INTO material (TrainingID, M1_Title, M1_Description, M1_File)
                VALUES (?, ?, ?, ?)
            `;
            await Qexecution.queryExecute(insertMaterialSQL, [
                TrainingID, 
                Title, 
                Description, 
                Material.buffer // Store the file as a buffer in the database
            ]);
            return res.status(200).send({
                status: "success",
                message: "Material added successfully to M1.",
            });
        } else {
            // If the record exists, check for the first empty column to store the material
            let materialUpdated = false;

            for (let i = 0; i < materialColumns.length; i++) {
                const materialColumn = materialColumns[i];
                const titleColumn = titleColumns[i];
                const descColumn = descColumns[i];

                // Check if the material column is null
                if (existingMaterial[0][materialColumn] === null) {
                    // Update the first empty column
                    const updateMaterialSQL = `
                        UPDATE material
                        SET 
                            ${titleColumn} = ?, 
                            ${descColumn} = ?, 
                            ${materialColumn} = ?
                        WHERE TrainingID = ?
                    `;
                    await Qexecution.queryExecute(updateMaterialSQL, [
                        Title,
                        Description,
                        Material.buffer, // Store the file as a buffer in the database
                        TrainingID
                    ]);

                    materialUpdated = true;
                    return res.status(200).send({
                        status: "success",
                        message: `Material added successfully to ${materialColumn}.`,
                    });
                }
            }

            if (!materialUpdated) {
                return res.status(400).send({
                    status: "fail",
                    message: "All material columns are already occupied for this training.",
                });
            }
        }
    } catch (err) {
        console.error("Error adding material:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error adding material.",
            error: err.message,
        });
    }
};

// API to Get All Materials for a Specific Training
exports.getMaterials = async (req, res) => {
    const { TrainingID } = req.params; // TrainingID is passed as a path parameter

    // SQL Query to Fetch All Materials for the Given TrainingID
    const getMaterialsSQL = `
        SELECT 
            M1_Title, M1_Description, M1_File,
            M2_Title, M2_Description, M2_File,
            M3_Title, M3_Description, M3_File,
            M4_Title, M4_Description, M4_File,
            M5_Title, M5_Description, M5_File,
            M6_Title, M6_Description, M6_File
        FROM material
        WHERE TrainingID = ?
    `;

    try {
        // Execute the query to fetch materials
        const materials = await Qexecution.queryExecute(getMaterialsSQL, [TrainingID]);

        if (materials.length === 0) {
            return res.status(404).send({
                status: "fail",
                message: "No materials found for the given training ID.",
            });
        }

        // Transform the result into a structured response
        const materialData = materials[0];
        const materialList = [];

        // Iterate through the columns to gather non-null materials
        for (let i = 1; i <= 6; i++) {
            const title = materialData[`M${i}_Title`];
            const description = materialData[`M${i}_Description`];
            const file = materialData[`M${i}_File`];

            if (title && description && file) {
                materialList.push({
                    Title: title,
                    Description: description,
                    File: file.toString('base64'), // Convert binary data to base64 for transfer
                });
            }
        }

        return res.status(200).send({
            status: "success",
            materials: materialList,
        });
    } catch (err) {
        console.error("Error fetching materials:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error fetching materials.",
            error: err.message,
        });
    }
};

exports.getweeks = async (req, res) => {
    const { TrainingID } = req.params;

    const SQL1 = "SELECT WeekNumber, WeekDates FROM leaderboard WHERE TrainingID = ?";

    try {
        // Execute the query to get the weeks from the database
        const response = await Qexecution.queryExecute(SQL1, [TrainingID]);
        // console.log(response);

        // Extract WeekNumber from each record in the response and create a list of weeks
        const weeks = response.map(item => item.WeekNumber);
        const dates = response.map(item => item.WeekDates);

        // Return the list of weeks in the response
        return res.status(200).send({
            status: "success",
            weeks: weeks,
            dates: dates
        });
    } catch (err) {
        // Handle any errors that occur during the database operation
        res.status(500).send({
            status: "fail",
            error: err.message,
        });
    }
};

// API to Get All Trainees from the latest leaderboard
exports.getFullLeaderboard = async (req, res) => {
    const { TrainingID, WeekNumber } = req.params; // Assuming TrainingID is passed as a URL parameter

    const getLatestLeaderboardSQL = `
        SELECT LeaderboardID, WeekDates, Ranking, Score
        FROM leaderboard
        WHERE TrainingID = ? AND WeekNumber = ?
        ORDER BY LeaderboardID DESC
        LIMIT 1
    `;

    try {
        // Get the latest leaderboard for the given TrainingID
        const latestLeaderboard = await Qexecution.queryExecute(getLatestLeaderboardSQL, [TrainingID, WeekNumber]);
        if (!latestLeaderboard.length) {
            return res.status(200 ).send({
                status: "fail",
                message: "No leaderboard found for the given training.",
            });
        }

        const { LeaderboardID, Ranking, Score } = latestLeaderboard[0];

        // Split the comma-separated lists of trainee IDs and scores
        const rankingList = Ranking.split(", ");
        const scoreList = Score.split(", ");

        // Prepare the response
        const allTrainees = [];
        for (let i = 0; i < rankingList.length; i++) {
            const traineeID = rankingList[i];
            const score = scoreList[i];
            
            // Get the name of the trainee
            const getTraineeSQL = `SELECT Name FROM Trainee WHERE TraineeID = ? AND TrainingID = ?`;
            const trainee = await Qexecution.queryExecute(getTraineeSQL, [traineeID, TrainingID]);

            if (trainee.length) {
                allTrainees.push({
                    Name: trainee[0].Name,
                    Score: score, // Use the score from the leaderboard
                });
            }
        }

        res.status(200).send({
            status: "success",
            message: "All trainees fetched successfully.",
            allTrainees,
        });
    } catch (err) {
        console.error("Error fetching all trainees:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error fetching all trainees.",
            error: err.message,
        });
    }
};

exports.getSubmissionsBasedOnDate = async (req,res) => {
    const {TrainingID, Date, TraineeID} = req.params;
    const SQL1 = "SELECT Approved, Example, Refer, Photo FROM submissions WHERE TrainingID = ? AND Date = ? AND TraineeID = ?";
    try{
        const result = await Qexecution.queryExecute(SQL1, [TrainingID, Date, TraineeID]);
        const sub = result[0];
        console.log(TrainingID, Date, TraineeID);
        if(sub){
            res.status(200).send({
                status: "success",
                message: "submission fetched successfully.",
                submission: sub,
            });
        }
        else{
            res.status(201).send({
                status: "success",
                message: "No submission found for this trainee.",
            });
        }
    } catch (err) {
        console.error("Error fetching submissions:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error fetching submissions.",
            error: err.message,
        });
    }
}

exports.approve = async (req, res) => {
    const { TrainingID, TraineeIDs, Date } = req.body;

    try {
        // Step 1: Loop through all the TraineeIDs
        for (const TraineeID of TraineeIDs) {
            // console.log(TraineeID);
            // Step 2: Query the submissions table for each TraineeID, TrainingID, and Date
            const submissionQuery = `SELECT * FROM submissions WHERE TraineeID = ? AND TrainingID = ? AND Date = ?`;
            const submissionResult = await Qexecution.queryExecute(submissionQuery, [TraineeID, TrainingID, Date]);

            if (submissionResult.length === 0) {
                // No submission found for this trainee, skip to the next one
                console.log(`No submission present for TraineeID ${TraineeID} on the provided date.`);
                continue;
            }

            const submission = submissionResult[0];
            // console.log(submission);

            // Step 3: Check the current approval status
            if (submission.Approved === 0 || submission.Approved === null) {
                // Not approved yet, calculate points and update the score
                let pointsToAdd = 0;

                if (submission.Example) {
                    pointsToAdd += 10; // Add 10 points if Example exists
                }

                if (submission.Photo) {
                    pointsToAdd += 15; // Add 15 points if Photo exists
                }

                if (submission.Refer) {
                    pointsToAdd += 15; // Add 15 points if Refer exists
                }

                // console.log(pointsToAdd);

                // Update trainee score
                const newScore = await updateTraineeScore(TraineeID, pointsToAdd);

                // Update the Approved field in the submissions table
                const updateQuery = `UPDATE submissions SET Approved = 1 WHERE TraineeID = ? AND TrainingID = ? AND Date = ?`;
                await Qexecution.queryExecute(updateQuery, [TraineeID, TrainingID, Date]);

                // console.log(`TraineeID ${TraineeID} score updated to ${newScore}`);
            } else if (submission.Approved === 1) {
                // Submission is already approved, skip this trainee
                // console.log(`Submission for TraineeID ${TraineeID} is already approved.`);
                continue;
            }
        }

        // Step 4: Return a success response after processing all trainees
        res.status(200).send({ message: "Submissions processed successfully." });

    } catch (error) {
        console.error("Error in approve function:", error.message);
        res.status(500).send({ message: "An error occurred while approving submissions." });
    }
};

exports.disapprove = async (req, res) => {
    const { TrainingID, TraineeIDs, Date } = req.body;

    try {
        // console.log(TrainingID, TraineeIDs, Date);
        const SQL2 = "SELECT Topic FROM training WHERE TrainingID = ?"; // Query to get the training name
        const res2 = await Qexecution.queryExecute(SQL2, [TrainingID]);
        const topic = res2[0].Topic;
        // Step 1: Loop through all the TraineeIDs
        for (const TraineeID of TraineeIDs) {
            // console.log(TraineeID);
            // Step 2: Query the submissions table for each TraineeID, TrainingID, and Date
            const SQL1 = "SELECT TraineeID, TrainingID, Endpoint FROM trainee WHERE TraineeID = ? AND TrainingID=?";
            const res1 = await Qexecution.queryExecute(SQL1, [TraineeID, TrainingID]);
            const Endpoint = res1[0].Endpoint;
            const message = `Your submission for the training ${topic} for the date ${Date} has been disapproved. Kindly re submit your details. For further details, contact your administrator`;
            const payload = JSON.stringify({ title: topic, message });
              
            const subscription = JSON.parse(Endpoint);
    
            try {
                // Send notification to each trainee's endpoint
                await webpush.sendNotification(subscription, payload);
                console.log(`Notification sent to trainee ${TraineeID} successfully.`);
            } catch (error) {
                console.error(`Error sending notification to trainee ${TraineeID}:`, error);
            }
        }
        // Step 4: Return a success response after processing all trainees
        res.status(200).send({ message: "Submissions processed successfully." });

    } catch (error) {
        console.error("Error in approve function:", error.message);
        res.status(500).send({ message: "An error occurred while approving submissions." });
    }
};

exports.getTraineesForTraining1 = async (req, res) => {
    // Query to join Training and Trainee tables and fetch Trainees
    const SQL = "SELECT TraineeID, Name FROM trainee WHERE TrainingID = ?";

    try {
        const { TrainingID } = req.params; // Get TrainingID from request params

        // Execute the JOIN query
        const result = await Qexecution.queryExecute(SQL, [TrainingID]);

        if (result.length === 0) {
            return res.status(400).send({
                status: "fail",
                message: "No trainees found for this training or invalid TrainingID",
            });
        }

        // Success response with trainee data
        res.status(200).send({
            status: "success",
            data: result, // List of TraineeID and Name
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error retrieving trainees",
            error: err.message,
        });
    }
};

exports.getSubmissionsOfTrainee = async (req, res) => {
    const { TrainingID, TraineeID } = req.params;

    const SQL1 = `
        SELECT Date, Example, Refer, Photo
        FROM submissions 
        WHERE TrainingID = ? AND TraineeID = ? 
        ORDER BY Date;
    `;

    try {
        // Execute the query using your database execution function
        const submissions = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID]);
        // console.log(submissions);

        if (submissions.length === 0) {
            return res.status(201).send({ message: 'No submissions found for the given TraineeID and TrainingID.' });
        }

        // // Convert all dates to UTC string format and add one day
        // submissions.forEach(submission => {
        //     // Parse the date in DD-MM-YYYY format
        //     const [day, month, year] = submission.Date.split('-').map(Number);
        //     const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
        
        //     // Add one day
        //     date.setDate(date.getDate() + 1);
        
        //     // Convert the date back to DD-MM-YYYY format
        //     const newDay = String(date.getDate()).padStart(2, '0');
        //     const newMonth = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month because it's 0-indexed
        //     const newYear = date.getFullYear();
        
        //     submission.Date = `${newDay}-${newMonth}-${newYear}`;
        // });
        


        return res.status(200).send(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error.message);
        return res.status(500).send({ message: "An error occurred while fetching submissions." });
    }
};

// API to Delete Material for a Training
exports.deleteMaterial = async (req, res) => {
    const { TrainingID, MaterialNumber } = req.params; // Expecting TrainingID and MaterialNumber (e.g., M1, M2, etc.)

    if (!TrainingID || !MaterialNumber) {
        return res.status(400).send({
            status: "fail",
            message: "TrainingID and MaterialNumber are required.",
        });
    }

    // Map MaterialNumber to the respective column names
    const materialColumns = ['M1_File', 'M2_File', 'M3_File', 'M4_File', 'M5_File', 'M6_File'];
    const titleColumns = ['M1_Title', 'M2_Title', 'M3_Title', 'M4_Title', 'M5_Title', 'M6_Title'];
    const descColumns = ['M1_Description', 'M2_Description', 'M3_Description', 'M4_Description', 'M5_Description', 'M6_Description'];

    // Determine the column index based on the MaterialNumber
    const materialIndex = parseInt(MaterialNumber) - 1; // For example, M1 => 0, M2 => 1, etc.
    // console.log("index is ",materialIndex);

    // Ensure MaterialNumber is valid
    if (materialIndex < 0 || materialIndex >= materialColumns.length) {
        return res.status(400).send({
            status: "fail",
            message: "Invalid MaterialNumber provided.",
        });
    }

    const deleteMaterialSQL = `
        SELECT * FROM Material WHERE TrainingID = ?
    `;

    try {
        // Get the existing material record
        const existingMaterial = await Qexecution.queryExecute(deleteMaterialSQL, [TrainingID]);

        if (existingMaterial.length === 0) {
            return res.status(404).send({
                status: "fail",
                message: "No material record found for the given TrainingID.",
            });
        }

        // Check if the material exists in the specified column
        if (!existingMaterial[0][materialColumns[materialIndex]]) {
            return res.status(404).send({
                status: "fail",
                message: `Material ${MaterialNumber} does not exist.`,
            });
        }

        // SQL query to delete the material by setting it to null
        const deleteMaterialQuery = `
            UPDATE Material
            SET
                ${materialColumns[materialIndex]} = NULL,
                ${titleColumns[materialIndex]} = NULL,
                ${descColumns[materialIndex]} = NULL
            WHERE TrainingID = ?
        `;
        await Qexecution.queryExecute(deleteMaterialQuery, [TrainingID]);

        // Shift the materials to fill the gap left by the deleted material
        for (let i = materialIndex; i < materialColumns.length - 1; i++) {
            const shiftMaterialSQL = `
                UPDATE Material
                SET
                    ${materialColumns[i]} = ${materialColumns[i + 1]},
                    ${titleColumns[i]} = ${titleColumns[i + 1]},
                    ${descColumns[i]} = ${descColumns[i + 1]}
                WHERE TrainingID = ?
            `;
            await Qexecution.queryExecute(shiftMaterialSQL, [TrainingID]);
        }

        // Set the last material (M6) as null after shifting
        const lastMaterialSQL = `
            UPDATE Material
            SET
                ${materialColumns[materialColumns.length - 1]} = NULL,
                ${titleColumns[titleColumns.length - 1]} = NULL,
                ${descColumns[descColumns.length - 1]} = NULL
            WHERE TrainingID = ?
        `;
        await Qexecution.queryExecute(lastMaterialSQL, [TrainingID]);

        return res.status(200).send({
            status: "success",
            message: `Material ${MaterialNumber} deleted successfully and other materials shifted.`,
        });
    } catch (err) {
        console.error("Error deleting material:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error deleting material.",
            error: err.message,
        });
    }
};

exports.getTraineesForTraining2 = async (req, res) => {
    // Query to join Trainee and Chats tables and fetch common trainees for a specific TrainingID
    const SQL = `
        SELECT DISTINCT
            t.TraineeID, 
            t.Name 
        FROM 
            trainee t
        INNER JOIN 
            chats c 
        ON 
            t.TraineeID = c.TraineeID
        WHERE 
            t.TrainingID = ?
    `;

    try {
        const { t_id } = req.params; // Get TrainingID from request params

        const TrainingID = t_id;

        // Execute the JOIN query
        const result = await Qexecution.queryExecute(SQL, [TrainingID]);

        // Success response with trainee data
        res.status(200).send({
            status: "success",
            data: result, // List of TraineeID and Name
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error retrieving trainees",
            error: err.message,
        });
    }
};

exports.sendChat = async (req, res) => {

    const SQL = "INSERT INTO chats(TraineeID, TrainingID, ChatDetails, ByTrainee) VALUES(?,?,?,?)";
    try {
        const { TraineeID, TrainingID, Message } = req.body; // Get TrainingID from request params

        // Execute the JOIN query
        const result = await Qexecution.queryExecute(SQL, [TraineeID, TrainingID, Message, 0]);

        // Success response with trainee data
        res.status(200).send({
            status: "success",
            message: "Trainee chat inserted successfully"
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error inserting chat",
            error: err.message,
        });
    }
}

exports.getChat = async (req,res) => {
    // Query to join Training and Trainee tables and fetch Trainees
    const SQL = "SELECT * FROM chats WHERE TraineeID = ?";

    try {
        const { TraineeID } = req.params; // Get TrainingID from request params

        // Execute the JOIN query
        const result = await Qexecution.queryExecute(SQL, [TraineeID]);

        if (result.length === 0) {
            return res.status(200).send({
                status: "success",
                message: "No chats found for this trainee",
            });
        }

        // Success response with trainee data
        res.status(200).send({
            status: "success",
            data: result, // List of TraineeID and Name
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error retrieving trainees",
            error: err.message,
        });
    }
}

exports.disallow = async (req,res) => {
    const SQL1 = "UPDATE trainee SET Allowed = 0 WHERE TraineeID = ?";
    try{
        const {TraineeIDs} = req.body;
        // console.log(TraineeIDs)
                // Validate input
                if (!TraineeIDs || !Array.isArray(TraineeIDs)) {
                    return res.status(400).send({
                        status: "fail",
                        message: "Invalid or missing TraineeIDs array",
                    });
                }
        
                // Execute the SQL query for each trainee ID
                for (const id of TraineeIDs) {
                    const res = await Qexecution.queryExecute(SQL1, [id]);
                }

    // Success response with trainee data
        res.status(200).send({
            status: "success", // List of TraineeID and Name
        });
        } catch (err) {
            console.error("Error:", err.message);
            res.status(500).send({
                status: "fail",
                message: "Error disallowing login of trainees",
                error: err.message,
            });
    }
}


