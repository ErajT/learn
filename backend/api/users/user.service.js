const pool = require('./../../config/database')
const Qexecution = require('./../../Controllers/query')
const crypto = require('crypto');

module.exports= {
    create: (data,callBack)=>{
        pool.query(
            `select * from registration where email = ?`,
            [data.email],
            (error, results) => {
                if (error) {
                    return callBack(error);
                }
                if (results.length > 0) {
                    // Email already exists
                    return callBack(null, results);
                } else {
                    // Insert the new user
                    pool.query(
                        `insert into registration(email, password, position, id, Allowed) values(?,?,?,?,?)`,
                        [data.email, data.password, data.position, data.id, 1],
                        (error, results) => {
                            if (error) {
                                return callBack(error);
                            }
                            return callBack(null, results );
                        }
                    );
                }
            }
        );        
    },
    getUserByEmail: async (email,callBack)=>{
        const SQL= "SELECT * FROM registration where email= ? AND Allowed = ?";
        try{
            const result=await Qexecution.queryExecute(SQL,[email, 1]);
            return callBack(null,result[0]);
        }catch(err){
            return callBack(err);
        }
    },
    checkIfLoggedInByToken: async (token,req,res)=>{
        const SQL= "SELECT * FROM session";
        const encrypted=crypto.createHash('sha256').update(token).digest('hex');
        try{
            const result= await Qexecution.queryExecute(SQL);
            const tokens= result.map(data=> data.token)
            if(tokens.includes(encrypted)) {
                console.log('true');
                return true
            }else{
                console.log('false');
                return false;
            }
        }catch(err){
            return res.json({
                status: "fail",
                message: err.message
            });
        }
    },
    resetPwd: async (updatedPwd,email,callBack)=>{
        const SQL= "UPDATE registration SET password = ? WHERE email=?";
        try{
            const result = await Qexecution.queryExecute(SQL,[updatedPwd,email]);
            return callBack(null,result);
        }catch(err){
            return callBack(err);
        }
    },

    loginSession: async (token,email,callBack)=>{
        const SQL="INSERT INTO session VALUES(?,?)";
        try{
            const result= await Qexecution.queryExecute(SQL,[email,token]);
            return callBack(null,result)
        }
        catch(err){
            return callBack(err);
        }
    },
    checkIfLoggedInByEmail: async (email,req,res)=>{
        const SQL= "SELECT * FROM session";
        try{
            const result= await Qexecution.queryExecute(SQL);
            const emails= result.map(data=> data.email)
            if(emails.includes(email)) {
                // console.log('true');
                const SQL2= "DELETE FROM session WHERE email=?"
                const result2= await Qexecution.queryExecute(SQL2,[email]);
                return;
            }
        }catch(err){
            return res.json({
                status: "fail",
                message: err.message
            });
        }
    },
    logout: async (token,req,res)=>{
        const SQL= "DELETE FROM session WHERE token=?";
        try{
            // console.log("token: ",token)
            const result= await Qexecution.queryExecute(SQL,[token]);
            if(result.affectedRows===0){
                throw Error('You aren\'t logged in' );
            }
            else{
                return res.status(200).json({
                    status: "success",
                    message: "Successfully logged out"
                });
            }
        }catch(err){
            return res.status(400).json({
                status: "fail",
                message: err.message
            });
        }
    }
}