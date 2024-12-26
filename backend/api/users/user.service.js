const pool = require('./../../config/database')
const Qexecution = require('./../../Controllers/query')

module.exports= {
    create: (data,callBack)=>{
        pool.query(
            `insert into registration(email,password,position,id) values(?,?,?,?)`,
            [data.email,data.password,data.position,data.id],
            (error,results)=>{
                if(error){
                    return callBack(error)
                }
                return callBack(null,results)
            }
        )
    },
    getUserByEmail: async (email,callBack)=>{
        const SQL= "SELECT * FROM registration where email= ?";
        try{
            const result=await Qexecution.queryExecute(SQL,[email]);
            return callBack(null,result[0]);
        }catch(err){
            return callBack(err);
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
                console.log('true');
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
            console.log("token: ",token)
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