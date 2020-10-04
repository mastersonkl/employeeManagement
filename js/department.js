const   mysql       = require("mysql");
const   inquirer    = require("inquirer");
var departments = [];
var roles = [];
var employees = [];

// create the connection information to sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    // Your username
    user: "root",
    // Your password
    password: "@Gail123",
    database: "employee_tracker"
  });

// calls function to access sql tables
connection.connect(function (err) {
    if (err) throw err;
    console.log("You are now connected");
    init();
    promptUser();
    // //   readEmployees();
    // // managers();
    // // supportEmployees();
    // pushDept();
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

  // displays the name of all departments
function viewDepartments() {
    console.log("Selecting all Departments");
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      console.log("\n" + chalk.green("Department Names"));
      // for loop to display all information selected
      for (var i = 0; i < res.length; i++) {
        console.log(chalk.blue(res[i].name));
      }
      promptUser();
    });
  }

  // prompts user with what they would like to do
function promptUser(answers) {
    return inquirer
      .prompt([
        {
          type: "list",
          name: "action",
          message: "What would you like to do?",
          choices: ["View", "Add", "Delete", "Edit", "Exit"],
        },
      ])
      .then((answers) => {
        if (answers.action === "View") {
          promptView();
        }
        if (answers.action === "Add") {
          promptAdd();
        }
        if (answers.action === "Delete") {
          promptDelete();
        }
        if (answers.action === "Edit") {
          promptEdit();
        }
        if (answers.action === "Exit") {
          endConn();
        }
      });
  }

  // prompts user with what they would like to view
function promptView() {
    return inquirer
      .prompt([
        {
          type: "list",
          name: "view",
          message: "What would you like to view",
          choices: [
            "All Departments",
            "All Roles",
            "All Employees",
            "All Managers",
            "Finance Employees",
            "Engineering Employees",
            "Support Employees",
            "Sales Employees",
          ],
        },
      ])
      .then((answers) => {
        if (answers.view === "All Departments") {
          viewDepartments();
        }
        if (answers.view === "All Roles") {
          viewRoles();
        }
        if (answers.view === "All Employees") {
          readEmployees();
        }
        if (answers.view === "All Managers") {
          managers();
        }
        if (answers.view === "Finance Employees") {
          financeEmployees();
        }
        if (answers.view === "Engineering Employees") {
          engineerEmployees();
        }
        if (answers.view === "Support Employees") {
          supportEmployees();
        }
        if (answers.view === "Sales Employees") {
          salesEmployees();
        }
      });
  }
  
  function addDept(answers) {
    return inquirer
      .prompt([
        {
          type: "input",
          name: "addDept",
          message: "What is the name of your new department?",
        },
      ])
      .then((answers) => {
        connection.query(
          "INSERT into department SET ?",
          { name: answers.addDept },
          function (err, res) {
            if (err) throw err;
            viewDepartments();
          }
        );
      });
  }

  function deleteDept() {
    pushDept();
    return inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "What department would you like to delete?",
          choices: departments,
        },
      ])
      .then((answers) => {
        connection.query(
          "DELETE FROM department WHERE ?",
          {
            name: answers.dept,
          },
          function (err, res) {
            if (err) throw err;
          }
          // connection.query(
          //   "DELETE FROM department WHERE ?",
          //   {
          //     name: "Channa's Department",
          //   },
          //   function (err, res) {
          //     if (err) throw err;
          //   }
        );
        viewDepartments();
      });
  }
  
  // prompts user with what they would like to edit
function promptEdit() {
    return inquirer
      .prompt([
        {
          type: "list",
          name: "edit",
          message: "What would you like to edit",
          choices: ["Edit Departments", "Edit Roles", "Edit Employees"],
        },
      ])
      .then((answers) => {
        if (answers.edit === "Edit Departments") {
          editDept();
        }
        if (answers.edit === "Edit Roles") {
          editRole();
        }
        if (answers.edit === "Edit Employees") {
          editEmployee();
        }
      });
  }
  
  function editDept() {
    pushDept();
    return inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "What department would you like to edit?",
          choices: departments,
        },
        {
          type: "input",
          name: "deptName",
          message: "What would you like to change the department name to?",
        },
      ])
      .then((answers) => {
        let answer = answers.dept;
        let index = departments.indexOf(answer) + 1;
  
        connection.query(
          "UPDATE department SET ? WHERE ?",
          [
            {
              name: answers.deptName,
            },
            { id: index },
          ],
          function (err, res) {
            if (err) throw err;
          }
        );
        viewDepartments();
      });
  }