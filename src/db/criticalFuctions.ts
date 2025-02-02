import inquirer from "inquirer";
import { pool, connectToDb } from "./connection.js";

await connectToDb();

class CriticalFunc{
    
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


}

// exporting default instance of the class
export default new CriticalFunc();

