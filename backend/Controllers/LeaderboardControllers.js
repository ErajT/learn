const Qexecution = require("./query");
const webpush = require("web-push");
const sharp = require("sharp");

exports.getTraineeDetails = async (req, res) => {
    const SQL = "SELECT * FROM trainee WHERE TraineeID=?";
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
    const SQL = "SELECT * FROM trainee WHERE TrainingID = ?";

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

exports.Example = async (req, res) => {
    const SQL1 = "SELECT Options FROM submissions WHERE TrainingID = ? AND TraineeID = ? AND Date = ?";
    const SQL2 = "INSERT INTO submissions(TraineeID, TrainingID, Date, Options, Example) VALUES(?,?,?,?,?)";
    const SQL3 = "UPDATE submissions SET Options = ?, Example = ?, Approved=0 WHERE TraineeID = ? AND TrainingID = ? AND Date = ?";

    try {
        const { TrainingID, TraineeID, Example, newDate } = req.body;

        const result1 = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID, newDate]);
        let pointsAwarded = 10;  // Points for Example submission

        if (result1.length != 0) {
            let currentOptions = result1[0]["Options"] || "";
            const newOptions = currentOptions + ",2";
            await Qexecution.queryExecute(SQL3, [newOptions, Example, TraineeID, TrainingID, newDate]);
        } else {
            const newOptions = "2";
            await Qexecution.queryExecute(SQL2, [TraineeID, TrainingID, newDate, newOptions, Example]);
        }

        // Call the updateTraineeScore function to update the score
        // await updateTraineeScore(TraineeID, pointsAwarded);

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
    const { TrainingID, TraineeID, newDate } = req.body;
    const SQL1 = "SELECT Options FROM submissions WHERE TrainingID = ? AND TraineeID = ? AND Date = ?";
    const SQL2 = "INSERT INTO submissions(TraineeID, TrainingID, Date, Options, Photo) VALUES(?,?,?,?,?)";
    const SQL3 = "UPDATE submissions SET Options = ?, Photo = ? WHERE TraineeID = ? AND TrainingID = ? AND Date = ?";

    try {
        const photo = req.file;
        if (!photo) {
            return res.status(400).send({
                status: "fail",
                message: "No photo uploaded",
            });
        }

        // Compress the image using Sharp
        const compressedBuffer = await sharp(photo.buffer)
            .resize(800, 800, { fit: "inside" }) // Resize to 800x800 pixels (adjust as needed)
            .toFormat("jpeg", { quality: 70 }) // Convert to JPEG with 70% quality
            .toBuffer();

        const result1 = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID, newDate]);
        let pointsAwarded = 15; // Points for Photo submission

        if (result1.length !== 0) {
            let currentOptions = result1[0]["Options"] || "";
            const newOptions = currentOptions + ",3";
            await Qexecution.queryExecute(SQL3, [newOptions, compressedBuffer, TraineeID, TrainingID, newDate]);
        } else {
            const newOptions = "3";
            await Qexecution.queryExecute(SQL2, [TraineeID, TrainingID, newDate, newOptions, compressedBuffer]);
        }

        // Call the updateTraineeScore function to update the score
        // await updateTraineeScore(TraineeID, pointsAwarded);

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
    const SQL1 = "SELECT Options, Refer FROM submissions WHERE TrainingID = ? AND TraineeID = ? AND Date = ?";
    const SQL2 = "INSERT INTO submissions(TraineeID, TrainingID, Date, Options, Refer) VALUES(?,?,?,?,?)";
    const SQL3 = "UPDATE submissions SET Refer = ?, Options = ? WHERE TraineeID = ? AND TrainingID = ? AND Date = ?";

    try {
        const { TrainingID, TraineeID, refer, newDate } = req.body;
        // const { newDate, DayNumber } = getCurrentDateAndDay(); // Get current date and day

        const result1 = await Qexecution.queryExecute(SQL1, [TrainingID, TraineeID, newDate]);
        let pointsAwarded = 15;  // Points for Refer

        if (result1.length != 0) {
            const options = result1[0]["Options"] || "";
            const newOptions = options + ",4";
            await Qexecution.queryExecute(SQL3, [refer, newOptions, TraineeID, TrainingID, newDate]);
        } else {
            const newOptions = "4";
            await Qexecution.queryExecute(SQL2, [TraineeID, TrainingID, newDate, newOptions, refer]);
        }

        // Call the updateTraineeScore function to update the score
        // await updateTraineeScore(TraineeID, pointsAwarded);

        // Add 20 points to the referred trainee
        // await updateTraineeScore(refer, pointsAwarded);

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
        FROM training
    `;

    const getLastLeaderboardSQL = `
        SELECT LeaderboardID, WeekDates, WeekNumber
        FROM leaderboard
        WHERE TrainingID = ?
        ORDER BY LeaderboardID DESC
        LIMIT 1
    `;

    const getTraineesSQL = `
        SELECT TraineeID, COALESCE(Score, 0) AS Score
        FROM trainee
        WHERE TrainingID = ?
    `;

    const insertLeaderboardSQL = `
        INSERT INTO leaderboard (LeaderboardID, TrainingID, WeekNumber, WeekDates, Ranking, Score)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const resetSQL = `
        UPDATE trainee SET Score = 0
        WHERE TrainingID = ?
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

            // Get the last leaderboard details for the training (including the week dates)
            const lastLeaderboardResult = await Qexecution.queryExecute(getLastLeaderboardSQL, [TrainingID]);
            // console.log("last is ", lastLeaderboardResult);
            const lastLeaderboardID = lastLeaderboardResult[0]?.LeaderboardID || 0;
            // console.log("id is ",lastLeaderboardID);
            const lastWeekDates = lastLeaderboardResult[0]?.WeekDates;

            // If a leaderboard for the current week already exists, skip this training
            if (lastWeekDates) {
                const [startDate, endDate] = lastWeekDates.split(" - ");
                const currentDate = new Date();
                const endDateOfLastWeek = new Date(endDate);

                // Check if the end date of the last leaderboard matches today's date
                if (currentDate.toISOString().split('T')[0] === endDateOfLastWeek.toISOString().split('T')[0]) {
                    results.push({ TrainingID, message: `Leaderboard for this week has already been generated.` });
                    continue;
                }
            }

            // Get all trainees and their scores for the training
            const trainees = await Qexecution.queryExecute(getTraineesSQL, [TrainingID]);

            if (!trainees.length) {
                results.push({ TrainingID, message: "No trainees found for this training." });
                continue;
            }

            // Sort trainees by score in descending order
            const sortedTrainees = trainees.sort((a, b) => b.Score - a.Score);

            // Generate ranking and score list
            const rankingString = sortedTrainees.map(r => r.TraineeID).join(", ");
            const scoresString = sortedTrainees.map(r => Number(r.Score).toFixed(2)).join(", ");

            // Calculate the start and end dates for the leaderboard (7 days window)
            const currentDate = new Date();
            const startDate = new Date();
            startDate.setDate(currentDate.getDate() - 6); // Include the last 7 days

            // Utility function to format date as dd-mm-yyyy
            const formatDate = (date) => {
            const dd = String(date.getDate()).padStart(2, '0'); // Day with leading zero
            const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero
            const yyyy = date.getFullYear(); // Year
            return `${dd}-${mm}-${yyyy}`;
            };

            // Format both dates
            const weekDates = `${formatDate(startDate)} - ${formatDate(currentDate)}`;

            console.log(weekDates);

            // Increment leaderboard ID and week number for the new leaderboard
            const newLeaderboardID = lastLeaderboardID + 1;
            const newWeekNumber = (lastLeaderboardResult[0]?.WeekNumber || 0) + 1;

            // Save leaderboard entry
            await Qexecution.queryExecute(insertLeaderboardSQL, [
                newLeaderboardID,
                TrainingID,
                newWeekNumber,
                weekDates,
                rankingString,
                scoresString,
            ]);

            await Qexecution.queryExecute(resetSQL, [TrainingID]);

            results.push({
                TrainingID,
                leaderboard: {
                    LeaderboardID: newLeaderboardID,
                    WeekNumber: newWeekNumber,
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

// API to Get Top Three Trainees based on the latest leaderboard
exports.getTopThreeTrainees = async (req, res) => {
    const { TrainingID } = req.params; // Assuming TrainingID is passed as a URL parameter

    const getLatestLeaderboardSQL = `
        SELECT LeaderboardID, WeekDates, Ranking, Score
        FROM leaderboard
        WHERE TrainingID = ?
        ORDER BY LeaderboardID DESC
        LIMIT 1
    `;

    try {
        // Get the latest leaderboard for the given TrainingID
        const latestLeaderboard = await Qexecution.queryExecute(getLatestLeaderboardSQL, [TrainingID]);
        if (!latestLeaderboard.length) {
            return res.status(200).send({
                status: "fail",
                message: "No leaderboard found for the given training.",
            });
        }

        const { Ranking, Score } = latestLeaderboard[0];

        // Split the comma-separated lists of trainee IDs and scores
        const rankingList = Ranking.split(", ");
        const scoreList = Score.split(", ");

        // Prepare the response
        const topThree = [];
        for (let i = 0; i < 3; i++) {
            const traineeID = rankingList[i];
            const score = scoreList[i];
            
            // Get the name of the trainee
            const getTraineeSQL = `SELECT Name FROM trainee WHERE TraineeID = ? AND TrainingID = ?`;
            const trainee = await Qexecution.queryExecute(getTraineeSQL, [traineeID, TrainingID]);

            if (trainee.length) {
                topThree.push({
                    Name: trainee[0].Name,
                    Score: score, // Use the score from the leaderboard
                });
            }
        }

        res.status(200).send({
            status: "success",
            message: "Top three trainees fetched successfully.",
            topThree,
        });
    } catch (err) {
        console.error("Error fetching top three trainees:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error fetching top three trainees.",
            error: err.message,
        });
    }
};

// API to Get All Trainees from the latest leaderboard
exports.getFullLeaderboard = async (req, res) => {
    const { TrainingID } = req.params; // Assuming TrainingID is passed as a URL parameter

    const getLatestLeaderboardSQL = `
        SELECT LeaderboardID, WeekDates, Ranking, Score
        FROM leaderboard
        WHERE TrainingID = ?
        ORDER BY LeaderboardID DESC
        LIMIT 1
    `;

    try {
        // Get the latest leaderboard for the given TrainingID
        const latestLeaderboard = await Qexecution.queryExecute(getLatestLeaderboardSQL, [TrainingID]);
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
            const getTraineeSQL = `SELECT Name FROM trainee WHERE TraineeID = ? AND TrainingID = ?`;
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

exports.getDetails = async (req, res) => {
    // SQL query to join Trainee, Training, and Company tables
    const SQL = `
        SELECT 
            trainee.*, 
            training.Topic AS TrainingName, 
            company.Name AS CompanyName 
        FROM 
            trainee 
        LEFT JOIN 
            training 
        ON 
            trainee.TrainingID = training.TrainingID 
        LEFT JOIN 
            company 
        ON 
            trainee.CompanyID = company.CompanyID 
        WHERE 
            trainee.Email = ? and trainee.Allowed = 1`;

    try {
        const { email } = req.params; // Get email from request parameters
        // console.log(email); hello there

        // Execute the query with the provided email
        const result = await Qexecution.queryExecute(SQL, [email]);
        // console.log(result);

        // Check if the result is empty
        if (result.length === 0) {
            res.status(400).send({
                status: "fail",
                message: "Login not allowed",
            });
        } else {
            res.status(200).send({
                status: "success",
                data: result, // Send the result with training and company details
            });
        }
    } catch (err) {
        // Handle errors
        res.status(404).send({
            status: "fail",
            message: "Error getting trainee details",
            error: err.message,
        });
    }
};

exports.saveSubscription = async (req,res) => {
    const {traineeID, subscription} = req.body;
    const SQL1 = "UPDATE trainee SET Endpoint = ? WHERE TraineeID=?";
    try{

        const subs = JSON.stringify(subscription);
        const response = await Qexecution.queryExecute(SQL1, [subs, traineeID]);
        // console.log(traineeID, " subscription is: ", subscription.endpoint)
        res.status(200).send({
            status: "success",
            message: "Subscription saved successfully."
        });
    } catch (err) {
        // console.error("Error fetching all trainees:", err.message);
        res.status(500).send({
            status: "fail",
            message: "Error saving subscription.",
            error: err.message,
        });
    }
};

// VAPID keys (ensure these match your configuration)
const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

// Set VAPID details
webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);


exports.subscribe = async (req, res) => {
    const { TrainingID, message } = req.body; // Extract message from the request body
    if (!message) {
      return res.status(400).json({ message: "Message is required in the request body." });
    }
  
    const SQL1 = "SELECT TraineeID, TrainingID, Endpoint FROM trainee WHERE TrainingID=?";
    const SQL2 = "SELECT Topic FROM training WHERE TrainingID = ?"; // Query to get the training name
  
    try {
      // Execute the SQL query to get the list of subscriptions
      const traineeList = await Qexecution.queryExecute(SQL1, [TrainingID]);
  
      // Check if the response is an array and contains data
      if (Array.isArray(traineeList) && traineeList.length > 0) {
        for (let i = 0; i < traineeList.length; i++) {
          const trainee = traineeList[i];
  
          // Skip the trainee if the endpoint is null or undefined
          if (!trainee.Endpoint) {
            console.warn(`Skipping trainee ${trainee.TraineeID} due to missing endpoint.`);
            continue;
          }
  
          // Get the training name for the current trainee
          const trainingNameResult = await Qexecution.queryExecute(SQL2, [trainee.TrainingID]);
          const trainingName = trainingNameResult?.[0]?.Topic || "Training Notification";
  
          // Create the payload
          const payload = JSON.stringify({ title: trainingName, message });
  
          const subscription = JSON.parse(trainee.Endpoint);
  
          try {
            // Send notification to each trainee's endpoint
            await webpush.sendNotification(subscription, payload);
            console.log(`Notification sent to trainee ${trainee.TraineeID} successfully.`);
          } catch (error) {
            console.error(`Error sending notification to trainee ${trainee.TraineeID}:`, error);
          }
        }
  
        // Send success response after processing all subscriptions
        res.status(201).json({ message: "Notifications sent to all valid trainees." });
      } else {
        res.status(400).json({ message: "No trainee subscriptions found." });
      }
    } catch (error) {
      console.error("Error fetching subscriptions or sending notifications:", error);
      res.status(500).json({ message: "Failed to send notifications.", error: error.message });
    }
  };
  

exports.sendChat = async (req, res) => {

    const SQL = "INSERT INTO chats(TraineeID, TrainingID, ChatDetails, ByTrainee) VALUES(?,?,?,?)";
    try {
        const { TraineeID, TrainingID, Message } = req.body; // Get TrainingID from request params

        // Execute the JOIN query
        const result = await Qexecution.queryExecute(SQL, [TraineeID, TrainingID, Message, 1]);

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

