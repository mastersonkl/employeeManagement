var mysql = require("mysql");
const inquirer = require("inquirer");
// const pw = require("./js/pw");
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


//new employee

function addEmployee(){
  connection.query("SELECT * FROM roles", function(err,res){ 
      if (err) throw err;  
      for (i=0; i<res.length; i++){ 
          res[i].name = res[i].title; 
          res[i].value = res[i].id; 
          delete res[i].id; 
          delete res[i].title;  
      }
      roleOptions = res; 
      addEmployeeStepTwo(roleOptions); 
  })
  function addEmployeeStepTwo(roleOptions){ 
      connection.query("SELECT * FROM employees", function(err,res){ 
          if (err) throw err;  
          for (i=0; i<res.length; i++){ 
              var fullName = res[i].first_name + " " + res[i].last_name; 
              res[i].name = fullName;  
              res[i].value = res[i].role_id; 
              delete res[i].employee_id;  
              delete res[i].first_name; 
              delete res[i].last_name; 
          }
          managerOptions = res; 
          employeePrompt(roleOptions, managerOptions); 
      })
  }

  function employeePrompt(roleOptions, managerOptions){ 
  
      inquirer.prompt([{
          name: "first_name",
          type: "input",
          message: "What's the first name of the new employee?"
      },
      {
          name: "last_name",
          type: "input",
          message: "What's the last name of the new employee?"
      },
      { 
          name: "role_id", 
          type: "list", 
          message: "What's the employee's role?",
          choices: roleOptions
      }, 
      { 
          name: "manager_id", 
          type: "list", 
          message: "Who's the employee's manager?",
          choices: managerOptions
      }])
      
      .then(function(answer){ 
          const newEmployee = new Employee(answer.first_name, answer.last_name, answer.role_id, answer.manager_id);
          connection.query("INSERT INTO employees SET ?", newEmployee, function(err, res){ 
              if (err) throw err; 
              console.log (res.affectedRows + " was inserted into employees!\n")
              promptUser(); 

          })
        
      })
  }

}
// view all depts

function viewDepartments(){ 
  connection.query("SELECT * FROM departments", function(err,res){ 
      if (err) throw err; 
      console.table(res); 
      promptUser(); 

  })

}

//view all roles

function viewRoles(){ 
  connection.query("SELECT roles.title, roles.salary, departments.dept_name FROM roles INNER JOIN departments ON roles.department_id = departments.id", function(err,res){ 
      if (err) throw err; 
      console.table(res); 
      promptUser(); 

  })
}

//view all employees

function viewEmployees(){ 
  connection.query("SELECT employees.first_name, employees.last_name, roles.title FROM employees INNER JOIN roles ON employees.role_id = roles.id", function(err,res){ 
      if (err) throw err; 
      console.table(res); 
      startingPrompt(); 

  })

}


