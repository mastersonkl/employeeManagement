const util = require("util");
const inquirer = require("inquirer");
const pw = require("./pw");
const mysql = require("mysql");
const { initial } = require("lodash");


const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "@Gail123",
  database: "employee_tracker"
});


connection.connect(function(err){
    if (err) throw err;
    console.log("You are connected");
    initial();
    promptUser();
});

function pushDept() {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) reject(err);
      // for loop to stringify dept names
      for (var i = 0; i < res.length; i++) {
        var deptName = res[i].name;
        departments.push(deptName);
      }
    });
  }