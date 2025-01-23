const { verify } = require("jsonwebtoken");
const { checkIfLoggedInByToken } = require('./../api/users/user.service');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.headers.authorization;
        // console.log(token);
        // let id;

        if (token) {
            if (token.startsWith("Bearer ")) {
                token = token.slice(7);
            }
            // console.log(token);
            verify(token, "eraj20", async (err, decoded) => {
                if (err) {
                    console.log("done");
                    return res.status(400).json({
                        status: "fail",
                        message: "Invalid token"
                    });
                }
                

                try {
                    // console.log("done");
                    const ifLoggedIn = await checkIfLoggedInByToken(token, req, res);
                    // console.log("in validation",ifLoggedIn);
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