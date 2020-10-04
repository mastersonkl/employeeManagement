const   mysql       = require("mysql");
const   inquirer    = require("inquirer");
let     totalCost   = '';
// create the connection information to sql database
const connection = mysql.createConnection({
    host: "localhost",
    // Your username
    user: "root",
    // Your password
    password: "@Gail123",
    database: "employee_tracker"
  });
