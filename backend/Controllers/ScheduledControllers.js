const Qexecution = require("./query");

exports.generateLeaderboard = async (req, res) => {
    const getAllTrainingsSQL = `
        SELECT TrainingID
        FROM Training
    `;

    const getLastLeaderboardSQL = `
        SELECT LeaderboardID, WeekDates, WeekNumber
        FROM Leaderboard
        WHERE TrainingID = ?
        ORDER BY LeaderboardID DESC
        LIMIT 1
    `;

    const getTraineesSQL = `
        SELECT TraineeID, COALESCE(Score, 0) AS Score
        FROM Trainee
        WHERE TrainingID = ?
    `;

    const insertLeaderboardSQL = `
        INSERT INTO Leaderboard (LeaderboardID, TrainingID, WeekNumber, WeekDates, Ranking, Score)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const resetSQL = `
        UPDATE Trainee SET Score = 0
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
