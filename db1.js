/*(e) Write a program to establish the connection between API and Database using Express – MySQL Driver
Install MySQL Driver

>npm install mysql8
________________________________________
Save the following program with name db5.js
*/
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: "bookstore"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Hi Prem! Connected to MySQL - Bookstore database");
    }
});

module.exports = connection;
