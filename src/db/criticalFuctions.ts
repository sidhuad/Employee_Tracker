import inquirer from "inquirer";
import { pool } from "./connection.js";

// await connectToDb();

class CriticalFunc {
  // addDepartment() method
  async addDepartment() {
    let loopPrompt = true;

    const promptQues = {
      type: "input",
      name: "userInput",
      message: "Please Enter Department Name: ",
    };

    while (loopPrompt) {
      const answer = await inquirer.prompt([promptQues]);
      if (answer.userInput && isNaN(answer.userInput)) {
        const match = await pool.query(
          `SELECT name FROM department WHERE name = $1`,
          [answer.userInput]
        );

        if (match.rowCount != 0) {
          console.log(`Department ${answer.userInput} already exists.`);
        } else {
          await pool.query(`INSERT INTO department(name) VALUES ($1)`, [
            `${answer.userInput}`,
          ]);
          console.log(`${answer.userInput} added to Department list`);
          const disNewDep = await pool.query(
            `SELECT * FROM department WHERE name = $1`,
            [answer.userInput]
          );
          console.table(disNewDep.rows);
        }
        loopPrompt = false;
      } else {
        console.log(`Please Enter A Valid Name!`);
      }
    }
  }

  // addRole() method
  async addRole() {
    let loopPrompt = true;

    const promptQues = [
      {
        type: "input",
        name: "roleDepartment",
        message: "Please Enter Department Name to add roles to: ",
        validate: (input: string) => {
          if (input.trim() === "") {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "roleTitle",
        message: "Please Enter Role Name: ",
        validate: (input: string) => {
          if (input.trim() === "") {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Please Enter Role Salary(Per Annum): ",
        validate: (input: number) => {
          if (input === 0 && !isNaN(input)) {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
    ];

    while (loopPrompt) {
      const answer = await inquirer.prompt(promptQues);

      const { roleDepartment, roleTitle, roleSalary } = answer;

      const match = await pool.query(
        `SELECT id FROM department WHERE name = $1`,
        [roleDepartment]
      );
      if (match.rowCount == 0) {
        console.log(`Department ${roleDepartment} does not exists.`);
        return;
      } else {
        const depId = match.rows[0].id;
        await pool.query(
          `INSERT INTO role(title,salary,department_id) VALUES ($1, $2, $3)`,
          [`${roleTitle}`, `${roleSalary}`, `${depId}`]
        );
        console.log(`${answer.roleTitle} added to Role list`);
        const disNewRole = await pool.query(`SELECT * FROM role`);
        console.table(disNewRole.rows);
      }

      loopPrompt = false;
    }
  }

  // addEmployee() method
  async addEmp() {
    let loopPrompt = true;

    const promptQues = [
      {
        input: "input",
        name: "fullName",
        message: "Enter Employees Full Name: ",
        validate: (input: string) => {
          if (input.trim() === "") {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
      {
        input: "input",
        name: "role",
        message: "Enter Employees Role Title: ",
        validate: (input: string) => {
          if (input.trim() === "") {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
      {
        input: "input",
        name: "managerName",
        message: "Enter Managers Full Name: ",
        validate: (input: string) => {
          if (input.trim() === "") {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
    ];

    while (loopPrompt) {
      const answer = await inquirer.prompt(promptQues);

      // destructuring answer object
      const { fullName, role, managerName } = answer;

      //splitting Employees fullName
      const firstName = fullName.split(" ")[0];
      const lastName = fullName.split(" ")[1];

      //spliting managers full name to use in query as first and last name to accurately get his id
      const manFirstName = managerName.split(" ")[0];
      const manLastName = managerName.split(" ")[1];

      if (
        firstName.trim() === manFirstName.trim() &&
        lastName.trim() === manLastName.trim()
      ) {
        // if employees first and last name matches the manager first and last name then he is the manager so his manager id is null.

        // getting role id by using and matching role title.
        const roleResult = await pool.query(
          "SELECT id FROM role WHERE title = $1",
          [`${role.trim()}`]
        );

        const roleId = roleResult.rows[0].id;

        // using log to check the values being passed manId does not exist for this scenario
        await pool.query(
          "INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ($1, $2, $3, NULL)",
          [`${firstName}`, `${lastName}`, `${roleId}`]
        );

        loopPrompt = false;
      } else {
        // getting manager emp id by using his name
        const manResult = await pool.query(
          "SELECT id FROM employee WHERE first_name = $1 AND last_name = $2",
          [`${manFirstName}`, `${manLastName}`]
        );

        // if manager doesnt exist log that manager is not an employee in the system
        if (manResult.rows.length === 0) {
          console.log('Manager Does not exist in the system');
          return;
        }
        // getting role id by using and matching role title.
        const empRole = answer.role.trim();
        const roleResult = await pool.query(
          "SELECT id FROM role WHERE title = $1",
          [`${empRole}`]
        );

        const roleId = roleResult.rows[0].id;
        const manId = manResult.rows[0].id;

        // using log to check the values being passed
        console.log(
          `first name: ${firstName} last name: ${lastName} role id:${roleId} manager id:${manId}`
        );
        await pool.query(
          "INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ($1, $2, $3, $4)",
          [`${firstName}`, `${lastName}`, `${roleId}`, `${manId}`]
        );

        loopPrompt = false;
      }
    }
  }

  // Update Employee Role
  async updateEmpRole() {
    // user input for emp full name
    const answer = await inquirer.prompt([
      {
        input: "input",
        name: "fullName",
        message: "Enter Employees Full Name: ",
        validate: (input: string) => {
          if (input.trim() === "") {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
    ]);

    const { fullName } = answer;
    // spliting emp name into first and last resp
    const firstName: string = fullName.split(" ")[0];
    const lastName: string = fullName.split(" ")[1];

    // displaying existing data for the emplyee searched before updating
    const empInfo = await pool.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title FROM employee JOIN role ON employee.role_id = role.id WHERE first_name = $1 AND last_name = $2`,
      [`${firstName}`, `${lastName}`]
    );

    if (empInfo.rows.length === 0) {
      console.log(`Employee does not exist`);
      return;
    }
    console.table(empInfo.rows);
    const empOldRole = empInfo.rows[0].title;

    const empOldDepName = await pool.query(
      `SELECT department.name FROM department JOIN role ON role.department_id = department.id WHERE role.title = $1`,
      [`${empOldRole}`]
    );
    console.log(empOldDepName.rows[0].name);

    const updateRole = await inquirer.prompt([
      {
        input: "input",
        name: "empNewRole",
        message: "Enter Employees New Role Title: ",
        validate: (input: string) => {
          if (input.trim() === "") {
            return `Invalid Input.`;
          } else {
            return true;
          }
        },
      },
    ]);

    const { empNewRole } = updateRole;

    const empNewDepName = await pool.query(
      `SELECT department.name FROM department JOIN role ON role.department_id = department.id WHERE title = $1`,
      [`${empNewRole}`]
    );

    const empNewRoleId = await pool.query(
      "SELECT id FROM role WHERE title = $1",
      [`${empNewRole}`]
    );

    // getting manager id to update when updating employee's role
    const manId = await pool.query(
      `SELECT employee.manager_id FROM employee JOIN role ON employee.role_id = role.id WHERE role.title = $1`,
      [`${empNewRole}`]
    );

    // console.log("new dep "+empNewDepName.rows[0].name+" old dep "+ empOldDepName.rows[0].name );
    // console.log(empNewRoleId.rows[0].id);

    if (empNewDepName.rows.length > 0) {
      if (empOldDepName.rows[0].name === empNewDepName.rows[0].name) {
        await pool.query(
          `UPDATE employee SET role_id = $1, manager_id = $2 WHERE first_name = $3 AND last_name = $4`,
          [
            `${empNewRoleId.rows[0].id}`,
            `${manId.rows[0].manager_id}`,
            `${firstName}`,
            `${lastName}`,
          ]
        );
        const newInfo = await pool.query(
          `SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id WHERE first_name = $1 AND last_name = $2`,
          [`${firstName}`, `${lastName}`]
        );
        console.log(`Update employee info`);
        console.table(newInfo.rows);
      } else {
        console.log(`Cannot set roles out of department`);
      }
    } else {
      console.log(`Role does not exist`);
    }
  }


  // delete department or role or an employee.
  async delDepRoleEmp() {
    try {
        const depList = await pool.query("SELECT name FROM department");
        const roleList = await pool.query("SELECT title FROM role");
        const empList = await pool.query(
          `SELECT first_name ||' '|| last_name AS employees FROM employee`
        );
    
        const depArray: string[] = depList.rows.map( element => element.name);
        const roleArray: string[] = roleList.rows.map(element => element.title);
        const empArray: string[] = empList.rows.map(element => element.employees);
    
        // console.log(depArray);
        // console.log(roleArray);
        // console.log(empArray);
        
        const answer = await inquirer.prompt([
          {
            type: "list",
            name: "deleteCate",
            message: "Choose a category to perform delete operation: ",
            choices: ["Departments", "Roles", "Employees"],
          },
        ]);
        if (answer.deleteCate === "Departments") {
          const answer = await inquirer.prompt([
            {
              type: "list",
              name: "deleteCate",
              message: "Choose a category to perform delete From: ",
              choices: [...depArray],
            },
          ]);
          await pool.query(`DELETE FROM department WHERE name = $1`, [
            `${answer.deleteCate}`,
          ]);
    
          console.log(`Department Deleted`);
        }
    
        if (answer.deleteCate === "Roles") {
          const answer = await inquirer.prompt([
            {
              type: "list",
              name: "deleteCate",
              message: "Choose a category to perform delete From: ",
              choices: [...roleArray],
            },
          ]);
          await pool.query(`DELETE FROM role WHERE title = $1`, [
            `${answer.deleteCate}`,
          ]);
    
          console.log(`Role Deleted`);
        }
    
        if (answer.deleteCate === "Employees") {
          const answer = await inquirer.prompt([
            {
              type: "list",
              name: "deleteCate",
              message: "Choose a category to perform delete From: ",
              choices: [...empArray],
            },
          ]);
          const firstName = answer.deleteCate.split(" ")[0];
          const lastName = answer.deleteCate.split(" ")[1];
          await pool.query(
            `DELETE FROM employee WHERE first_name = $1 AND last_name = $2`,
            [`${firstName}`, `${lastName}`]
          );
    
          console.log(`Employee Deleted`);
        }
    } catch (error) {
        console.error(error);
    }
   
  }

  // Update employee manager function
  async updateEmpManager() {
    const employee = await pool.query(
      `SELECT first_name ||' '|| last_name AS employees FROM employee`
    );
    const empArray: string[] = [];

    employee.rows.forEach((element) => {
      empArray.push(element.employees);
    });

    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "emp",
        message: "Choose Employee to update their Manager: ",
        choices: [...empArray],
      },
      {
        type: "input",
        name: "newMan",
        message: "Enter the name of new Manager",
      },
    ]);

    const empFirstName = answer.emp.split(' ')[0];
    const empLastName = answer.emp.split(' ')[1];

    const manFirstName = answer.newMan.split(' ')[0];
    const manLastName = answer.newMan.split(' ')[1];

    const getManId = await pool.query(`SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`,[`${manFirstName}`,`${manLastName}`]);

    if (getManId.rows.length === 0) {
      console.log(`Manager does not exist in the system.`);
      return;      
    }
    await pool.query(`UPDATE employee SET manager_id = $1 WHERE first_name = $2 AND last_name = $3`,[`${getManId.rows[0].id}`,`${empFirstName}`,`${empLastName}`]);

    console.log(`Manager id updated`);
    
  }

  // departmentBudget function()
  async departmentBudget(){
    const depList = await pool.query(`SELECT name FROM department`);

    const depArray: string [] = [];

    depList.rows.forEach(element => {
        depArray.push(element.name);
    })

    const answer = await inquirer.prompt([{
        type:'list',
        name:'depName',
        message:'Choose a Department Name to see the budget.',
        choices:[...depArray]
    }])


    const sumOfDep = await pool.query(`SELECT SUM(role.salary) AS total_budget FROM role JOIN department ON role.department_id = department.id WHERE department.name = $1`,[`${answer.depName}`]);

    console.table(sumOfDep.rows);
  }
}

// exporting default instance of the class
export default new CriticalFunc();
