const Qexecution = require("./query");
// const nodemailer = require("nodemailer");

exports.getTraineeDetails = async (req, res) => {
    const SQL = "SELECT * FROM Trainee";
    try {
      const result = await Qexecution.queryExecute(SQL);
      if (result.length === 0) {
        res.status(400).send({
          status: "fail",
          message: "No data available",
        });
      } else {
        res.status(200).send({
          status: "success",
          data: {
            trainers: result,
          },
        });
      }
    } catch (err) {
      res.status(404).send({
        status: "fail",
        message: "Error getting trainings",
        error: err.message,
      });
    }
  };