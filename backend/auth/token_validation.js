const { verify } = require("jsonwebtoken");
const { checkIfLoggedInByToken } = require('./../api/users/user.service');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.headers.authorization;
        let id;

        if (token) {
            token = token.slice(7);
            verify(token, "muneer123", async (err, decoded) => {
                if (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Invalid token"
                    });
                }
                

                try {
                    const ifLoggedIn = await checkIfLoggedInByToken(token, req, res);
                    console.log("in validation",ifLoggedIn);
                    if (ifLoggedIn) {
                        next();
                    } else {
                        return res.status(400).json({
                            status: "fail",
                            message: "You are not logged in!"
                        });
                    }
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        status: "error",
                        message: "Internal server error"
                    });
                }
            });
        } else {
            return res.status(400).json({
                status: "fail",
                message: "Access denied"
            });
        }
    }
};