const mysql = require('mysql');
//Database Connection

const connection=mysql.createPool({
    // connectionLimit: 6,
    // host: "127.0.0.1",
    // user: "root",
    // password: "root",
    // database: "learn",
    // port: 3306,
    // ssl: false
    // // ssl: false
    connectionLimit: 6,
    host: "qec-db-3.mysql.database.azure.com",
    user: "qecproject",
    password: "software22NED",
    database: "learn",
    port: 3306,
    ssl: true
})
connection.getConnection((err,connection)=>{
    if (err){
        return console.log(err);
    }
    connection.release();
    console.log("Database connected successfully!");
})

module.exports = connection;