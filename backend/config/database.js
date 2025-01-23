const mysql = require('mysql2');
//Database Connection

const connection=mysql.createPool({
    connectionLimit: 6,
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "learn",
    port: 3306,
    ssl: false
    // ssl: false
    
})
connection.getConnection((err,connection)=>{
    if (err){
        return console.log(err);
    }
    connection.release();
    console.log("Database connected successfully!");
})

module.exports = connection;