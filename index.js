const util = require("util");
const inquirer = require("inquirer");
const pw = require("./pw");
const mysql = require("mysql");
var Department = require("./js/department")
var Employee = require("./js/employee")
var Role = require("./js/role")



const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "@Gail123",
  database: "employee_tracker"
});


connection.connect(function (err) {
  if (err) throw err;
  console.log("You are connected");
  promptUser();
});

function promptUser() {
  inquirer
    .prompt({
      name: "startRequest",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add a department", "Add a role", "Add an employee", "View all departments", "View all roles",
        "View all employees", "Update an employee's role", "Update an employee's manager", "Delete an employee", "Done! Exit now."]
    })

    .then(function (answer) {

      if (answer.startRequest === "Add a department") {
        addDepartment();
      } else if (answer.startRequest === "Add a role") {
        addRole();
      } else if (answer.startRequest === "Add an employee") {
        addEmployee();
      } else if (answer.startRequest === "View all departments") {
        viewDepartments();
      } else if (answer.startRequest === "View all roles") {
        viewRoles();
      } else if (answer.startRequest === "View all employees") {
        viewEmployees();
      } else if (answer.startRequest === "Update an employee's role") {
        updateEmployeeRole();
      } else if (answer.startRequest === "Update an employee's manager") {
        updateEmployeeManager();
      } else if (answer.startRequest === "Delete an employee") {
        deleteEmployee();
      } else {
        connection.end();
      }
    });

}
//new dept
function addDepartment(){ 
  inquirer.prompt({
      name: "dept",
      type: "input",
      message: "What is the name of the new departmnet?",
  }).then(function(answer){ 
      const newDept = new Department(answer.dept);
      connection.query("INSERT INTO departments SET name = ?", [newDept.name], function(err, res){ 
          if (err) throw err; 
          console.log (res.affectedRows + " was inserted into departments!\n")
      })
     promptUser(); 
  })
};

//new role
function addRole(){
  connection.query("SELECT * FROM departments", function(err,res){ 
      if (err) throw err;  
      for (i=0; i<res.length; i++){ 
          res[i].value = res[i].id; 
          res[i].name = res[i].name; 
          delete res[i].name
          delete res[i].id; 
      }
      var deptOptions = res; 
      rolePrompt(deptOptions); 
  })
  

  function rolePrompt(deptOptions){ 
      inquirer.prompt([{
          name: "role",
          type: "input",
          message: "What's the name of the new role?"
      },
      { 
          name: "salary", 
          type: "input", 
          message: "What's the salary for the new position? Please enter only numbers, no $"
      }, 
      { 
          name: "dept_id", 
          type: "list", 
          message: "What department is the new role in?",
          choices: deptOptions
      }])
      
      .then(function(answer){ 
          const newRole = new Role(answer.role, answer.salary, answer.dept_id);
          connection.query("INSERT INTO roles SET ?", newRole, function(err, res){ 
              if (err) throw err; 
              console.log (res.affectedRows + " was inserted into roles!\n"); 
              promptUser(); 

          })

      })
  }

}

