var mysql = require("mysql");
const inquirer = require("inquirer");
var Department = require("./js/department")
var Employee = require("./js/employee")
var Role = require("./js/role")



const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
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
        "View all employees", "Update an employee's role", "Update an employee's manager", "Delete an employee", "Delete a role", "Delete a department", "Done! Exit now."]
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
      } else if (answer.startRequest === "Delete a role") {
        deleteRole();
      } else if (answer.startRequest === "Delete a department") {
        deleteDepartment();
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
      message: "What is the name of the new department?",
  }).then(function(answer){ 
      const newDept = new Department(answer.dept);
      connection.query("INSERT INTO departments SET name_dept = ?", [newDept.name_dept], function(err, res){ 
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
          res[i].name = res[i].name_dept; 
          delete res[i].name_dept;
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
  connection.query("SELECT roles.title, roles.salary, departments.name_dept FROM roles INNER JOIN departments ON roles.department_id = departments.id", function(err,res){ 
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
     promptUser(); 

  })

}


//update employee role

function updateEmployeeRole(){
  connection.query("SELECT * FROM roles", function(err,res){ 
      if (err) throw err;  
      for (i=0; i<res.length; i++){ 
          res[i].name = res[i].title; 
          res[i].value = res[i].id; 
          delete res[i].id; 
          delete res[i].title;  
      }
      roleOptions = res; 
      updateEmployeeStepTwo(roleOptions); 
  })

  function updateEmployeeStepTwo(roleOptions){
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
          employeeOptions = res; 
          updateEmployeeRolePrompt(employeeOptions, roleOptions); 
      }) 
  }

  function updateEmployeeRolePrompt(employeeOptions, roleOptions){ 
  
      inquirer.prompt([{
          name: "employee",
          type: "list",
          message: "Which employee do you want to update?", 
          choices: employeeOptions
      },
      {
          name: "newRole",
          type: "list",
          message: "What's their new role?",
          choices: roleOptions
      }
      ]).then(function(answer){ 
          connection.query("UPDATE employees SET ? WHERE ?", [{role_id: answer.newRole}, {id: answer.employee}], function(err, res){ 
              if (err) throw err; 
              console.log (res.affectedRows + " was updated in the employees table!\n")
              promptUser(); 

          })

      })
  }

}

//update employee manager/delete 

function updateEmployeeManager(){ 
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
      allEmployees = res; 
      updateEmployeeManagerPrompt(allEmployees); 
  }) 

  function updateEmployeeManagerPrompt(allEmployees){ 
  
      inquirer.prompt([{
          name: "employee",
          type: "list",
          message: "Which employee do you want to update?", 
          choices: allEmployees
      },
      {
          name: "newManager",
          type: "list",
          message: "Who's their new manager? If they do not have a manager, select their own name.",
          choices: allEmployees
      }
      ]).then(function(answer){ 
          connection.query("UPDATE employees SET ? WHERE ?", [{manager_id: answer.newManager}, {id: answer.employee}], function(err, res){ 
              if (err) throw err; 
              console.log (res.affectedRows + " was updated in the employees table!\n")
              promptUser(); 
          })
         

      })
  }

}

//delete employee 

function deleteEmployee() {
  connection.query("SELECT id, first_name, last_name FROM employees", function (
    err,
    result
  ) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "employeeName",
        type: "list",
        message: "Who is the employee you would like to delete?",
        choices: result.map(
          (employeeName) =>
            `${employeeName.id} ${employeeName.first_name} ${employeeName.last_name}`
        ),
      })
      .then(({ employeeName }) => {
        employeeName = employeeName.replace(/\D/g, "");
        console.log(employeeName);
        connection.query(
          "DELETE FROM employees WHERE ?",
          {
            id: employeeName,
          },
          function (err, result) {
            if (err) throw err;
          }
        );
        viewEmployees();
      });
  });
}

//delete role 

function deleteRole() {
  connection.query("SELECT * FROM roles", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "roleChosen",
        type: "list",
        message: "Which role would you like to delete?",
        choices: result.map((role) => role.title),
      })
      .then(({ roleChosen }) => {
        connection.query("DELETE FROM roles WHERE ?", {
          title: roleChosen,
        });
        viewRoles();
        promptUser();
      });
  });
}

//delete department 

function deleteDepartment() {
  connection.query("SELECT * FROM departments", function (err, result) {
    if (err) throw err;
    inquirer
      .prompt({
        name: "departmentChosen",
        type: "list",
        message: "Which department would you like to delete?",
        choices: result.map((department) => department.name_dept),
      })
      .then(({ departmentChosen }) => {
        connection.query("DELETE FROM departments WHERE ?", {
          name_dept: departmentChosen,
        });
        viewDepartments();
        promptUser();
      });
  });
}
