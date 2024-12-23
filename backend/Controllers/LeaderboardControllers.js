const Qexecution = require("./query");

// Utility function to get the current date and day number
const getCurrentDateAndDay = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const dd = String(today.getDate()).padStart(2, '0');
    const newDate = `${yyyy}-${mm}-${dd}`;
    const DayNumber = today.getDay();
    return { newDate, DayNumber };
};

const updateTraineeScore = async (TraineeID, pointsToAdd) => {
    try {
        // Query to get the current score of the trainee
        const currentScoreResult = await Qexecution.queryExecute("SELECT Score FROM Trainee WHERE TraineeID = ?", [TraineeID]);
        const currentScore = currentScoreResult.length ? currentScoreResult[0].Score : 0; // Default to 0 if score is null
        
        // Calculate the new score by adding the new points to the old score
        const newScore = (currentScore || 0) + pointsToAdd;

        // Update the trainee's score in the database
        await Qexecution.queryExecute("UPDATE Trainee SET Score = ? WHERE TraineeID = ?", [newScore, TraineeID]);

        return newScore;
    } catch (err) {
        console.error("Error updating trainee score:", err.message);
        throw new Error("Error updating trainee score");
    }
};


exports.getTraineeDetails = async (req, res) => {
    const SQL = "SELECT * FROM Trainee WHERE TraineeID=?";
    try {
        const { id } = req.params;
        const result = await Qexecution.queryExecute(SQL, [id]);
        if (result.length === 0) {
            res.status(400).send({
                status: "fail",
                message: "No data available",
            });
        } else {
            res.status(200).send({
                status: "success",
                data: result
            });
        }
    } catch (err) {
        res.status(404).send({
            status: "fail",
            message: "Error getting trainee",
            error: err.message,
        });
    }
};

exports.getTraineesForTraining = async (req, res) => {
    // Query to join Training and Trainee tables and fetch Trainees
    const SQL = `
        SELECT t.TraineeID, t.Name
        FROM Trainee t
        JOIN Training tr ON t.CompanyID = tr.CompanyID
        WHERE tr.TrainingID = ?
    `;

    try {
        const { id } = req.params; // Get TrainingID from request params

        // Execute the JOIN query
        const result = await Qexecution.queryExecute(SQL, [id]);

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

exports.simpleResponse = async (req, res) => {
    const SQL1 = "SELECT Options FROM Submissions WHERE TrainingID = ? AND TraineeID = ? AND Date = ?";
    const SQL2 = "INSERT INTO Submissions(TraineeID, TrainingID, DayNumber, Date, Options, SimpleResponse) VALUES(?,?,?,?,?,?)";
    const SQL3 = "UPDATE Submissions SET SimpleResponse = ?, Options = ? WHERE TraineeID = ? AND TrainingID = ? AND Date = ?";

    try {
        const { TrainingID, TraineeID } = req.body;
        const { newDate, DayNumber } = getCurrentDateAndDay(); // Get current date and day

        const result1 = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID, newDate]);
        const simple = true;
        let pointsAwarded = 2;  // Points for Simple Response

        if (result1.length != 0) {
            const options = result1[0]["Options"] || "";
            const newOptions = options + ",1";
            console.log("New Options:", newOptions);
            await Qexecution.queryExecute(SQL3, [simple, newOptions, TraineeID, TrainingID, newDate]);
        } else {
            await Qexecution.queryExecute(SQL2, [TraineeID, TrainingID, DayNumber, newDate, "1", simple]);
        }

        // Call the updateTraineeScore function to update the score
        await updateTraineeScore(TraineeID, pointsAwarded);

        res.status(200).send({
            status: "success",
            message: "response saved successfully"
        });
    } catch (err) {
        res.status(404).send({
            status: "fail",
            message: "Error saving response",
            error: err.message,
        });
    }
};

exports.Example = async (req, res) => {
    const SQL1 = "SELECT Options FROM Submissions WHERE TrainingID = ? AND TraineeID = ? AND Date = ?";
    const SQL2 = "INSERT INTO Submissions(TraineeID, TrainingID, DayNumber, Date, Options, Example) VALUES(?,?,?,?,?,?)";
    const SQL3 = "UPDATE Submissions SET Options = ?, Example = ? WHERE TraineeID = ? AND TrainingID = ? AND Date = ?";

    try {
        const { TrainingID, TraineeID, Example } = req.body;
        const { newDate, DayNumber } = getCurrentDateAndDay();

        const result1 = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID, newDate]);
        let pointsAwarded = 5;  // Points for Example submission

        if (result1.length != 0) {
            let currentOptions = result1[0]["Options"] || "";
            const newOptions = currentOptions + ",2";
            await Qexecution.queryExecute(SQL3, [newOptions, Example, TraineeID, TrainingID, newDate]);
        } else {
            const newOptions = "2";
            await Qexecution.queryExecute(SQL2, [TraineeID, TrainingID, DayNumber, newDate, newOptions, Example]);
        }

        // Call the updateTraineeScore function to update the score
        await updateTraineeScore(TraineeID, pointsAwarded);

        res.status(200).send({
            status: "success"
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(404).send({
            status: "fail",
            message: "Error processing submission",
            error: err.message,
        });
    }
};

exports.Photo = async (req, res) => {
    const { TrainingID, TraineeID } = req.body;
    const { newDate, DayNumber } = getCurrentDateAndDay();

    const SQL1 = "SELECT Options FROM Submissions WHERE TrainingID = ? AND TraineeID = ? AND Date = ?";
    const SQL2 = "INSERT INTO Submissions(TraineeID, TrainingID, DayNumber, Date, Options, Photo) VALUES(?,?,?,?,?,?)";
    const SQL3 = "UPDATE Submissions SET Options = ?, Photo = ? WHERE TraineeID = ? AND TrainingID = ? AND Date = ?";

    try {
        const photo = req.file;
        if (!photo) {
            return res.status(400).send({
                status: "fail",
                message: "No photo uploaded",
            });
        }

        const photoBuffer = photo.buffer;

        const result1 = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID, newDate]);
        let pointsAwarded = 15;  // Points for Photo submission

        if (result1.length !== 0) {
            let currentOptions = result1[0]["Options"] || "";
            const newOptions = currentOptions + ",3";
            await Qexecution.queryExecute(SQL3, [newOptions, photoBuffer, TraineeID, TrainingID, newDate]);
        } else {
            const newOptions = "3";
            await Qexecution.queryExecute(SQL2, [TraineeID, TrainingID, DayNumber, newDate, newOptions, photoBuffer]);
        }

        // Call the updateTraineeScore function to update the score
        await updateTraineeScore(TraineeID, pointsAwarded);

        res.status(200).send({
            status: "success",
            message: "Photo and options updated successfully",
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error processing photo submission",
            error: err.message,
        });
    }
};

exports.Refer = async (req, res) => {
    const SQL1 = "SELECT Options, Refer FROM Submissions WHERE TrainingID = ? AND TraineeID = ? AND Date = ?";
    const SQL2 = "INSERT INTO Submissions(TraineeID, TrainingID, DayNumber, Date, Options, Refer) VALUES(?,?,?,?,?,?)";
    const SQL3 = "UPDATE Submissions SET Refer = ?, Options = ? WHERE TraineeID = ? AND TrainingID = ? AND Date = ?";

    try {
        const { TrainingID, TraineeID, refer } = req.body;
        const { newDate, DayNumber } = getCurrentDateAndDay(); // Get current date and day

        if (TraineeID === refer) {
            return res.status(400).send({
                status: "fail",
                message: "You cannot refer yourself",
            });
        }

        const result1 = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID, newDate]);
        let pointsAwarded = 15;  // Points for Refer

        if (result1.length != 0) {
            const options = result1[0]["Options"] || "";
            const newOptions = options + ",4";
            await Qexecution.queryExecute(SQL3, [refer, newOptions, TraineeID, TrainingID, newDate]);
        } else {
            const newOptions = "4";
            await Qexecution.queryExecute(SQL2, [TraineeID, TrainingID, DayNumber, newDate, newOptions, refer]);
        }

        // Call the updateTraineeScore function to update the score
        await updateTraineeScore(TraineeID, pointsAwarded);

        // Add 20 points to the referred trainee
        await updateTraineeScore(refer, pointsAwarded);

        res.status(200).send({
            status: "success",
            message: "Refer response saved successfully",
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error saving refer response",
            error: err.message,
        });
    }
};

exports.generateLeaderboard = async (req, res) => {
    const getAllTrainingsSQL = `
        SELECT TrainingID
        FROM Training
    `;
    
    const getCompanyIDSQL = `
        SELECT CompanyID
        FROM Training
        WHERE TrainingID = ?
    `;
    
    const getLastLeaderboardSQL = `
        SELECT MAX(LeaderboardID) AS LastLeaderboardID
        FROM Leaderboard
        WHERE CompanyID = ?
    `;

    const getTraineesSQL = `
        SELECT t.TraineeID, COALESCE(t.Score, 0) AS Score, t.CompanyID
        FROM Trainee t
        INNER JOIN Training tr ON t.CompanyID = tr.CompanyID
        WHERE tr.TrainingID = ?
    `;
    
    const insertLeaderboardSQL = `
        INSERT INTO Leaderboard (LeaderboardID, CompanyID, WeekNumber, WeekDates, Ranking, Score)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        // Fetch all TrainingIDs
        const trainings = await Qexecution.queryExecute(getAllTrainingsSQL, []);
        if (!trainings.length) {
            return res.status(404).send({
                status: "fail",
                message: "No trainings found in the database.",
            });
        }

        const results = [];

        // Loop through each training and generate the leaderboard
        for (const training of trainings) {
            const { TrainingID } = training;

            // Get CompanyID from TrainingID
            const companyResult = await Qexecution.queryExecute(getCompanyIDSQL, [TrainingID]);
            if (!companyResult.length) {
                results.push({ TrainingID, message: "No company found for the provided training ID." });
                continue;
            }
            const companyID = companyResult[0].CompanyID;

            // Get the last leaderboard ID for the company using the companyID
            const lastLeaderboardResult = await Qexecution.queryExecute(getLastLeaderboardSQL, [companyID]);
            const lastLeaderboardID = lastLeaderboardResult[0]?.LastLeaderboardID || 0;
            const newLeaderboardID = lastLeaderboardID + 1; // Increment the last leaderboard ID

            // Get all trainees and their scores for the training
            const trainees = await Qexecution.queryExecute(getTraineesSQL, [TrainingID]);

            if (!trainees.length) {
                results.push({ TrainingID, message: "No trainees found for this training." });
                continue;
            }

            // Sort trainees by score in descending order
            const sortedTrainees = trainees.sort((a, b) => b.Score - a.Score);

            // Generate ranking and score list
            const rankings = sortedTrainees.map((trainee, index) => ({
                Rank: index + 1,
                TraineeID: trainee.TraineeID,
                Score: Number(trainee.Score).toFixed(2),
            }));

            const rankingString = rankings.map(r => `Rank ${r.Rank}: TraineeID ${r.TraineeID}`).join(", ");
            const scoresString = rankings.map(r => r.Score).join(", ");

            // Calculate the start and end dates for the leaderboard
            const currentDate = new Date();
            const startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 6); // Include the last 7 days

            const weekDates = `${startDate.toISOString().split('T')[0]} - ${currentDate.toISOString().split('T')[0]}`;

            // Save leaderboard entry
            await Qexecution.queryExecute(insertLeaderboardSQL, [
                newLeaderboardID,
                companyID,
                lastLeaderboardResult[0]?.LastWeek + 1 || 1, // Increment week number
                weekDates,
                rankingString,
                scoresString,
            ]);

            results.push({
                TrainingID,
                leaderboard: {
                    LeaderboardID: newLeaderboardID,
                    WeekNumber: lastLeaderboardResult[0]?.LastWeek + 1 || 1,
                    WeekDates: weekDates,
                    Rankings: rankingString,
                    Scores: scoresString,
                },
                message: "Leaderboard generated and saved successfully.",
            });
        }

        res.status(200).send({
            status: "success",
            message: "Leaderboards generated for all trainings.",
            results: results,
        });
    } catch (err) {
        console.error("Error generating leaderboards:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error generating leaderboards.",
            error: err.message,
        });
    }
};


