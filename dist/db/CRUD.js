// async await keywords to be used from the start and till very end of the link to have it execute properly, if not used data will not persist even though its being displayed but it will vanish as soon as next prompt is used.ex: from prompt till data is fetched async await is being applied to every function and step which returns or fetches or logs that data.
import inquirer from "inquirer";
import { pool, connectToDb } from "./connection.js";
import critFunc from "./criticalFuctions.js";
await connectToDb();
class httpVerbs {
    async action(verb) {
        await this.typeOfAction(verb);
    }
    async viewAllDep() {
        const result = await pool.query(`SELECT id,name FROM department`);
        console.table(result.rows);
    }
    async viewAllRoles() {
        const result = await pool.query(`SELECT role.title AS job_title, role.id AS role_id, department.name AS department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id`);
        console.table(result.rows);
    }
    async viewAllEmps() {
        const result = await pool.query(`SELECT employee.id AS Employee_id, employee.first_name, employee.last_name, role.title, role.salary,department.name AS Department_name, manager.first_name || ' '|| manager.last_name AS Managers
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
        console.table(result.rows);
    }
    async addRole() {
        let loopPrompt = true;
        const promptQues = [
            {
                type: "input",
                name: "roleDepartment",
                message: "Please Enter Department Name to add roles to: ",
                validate: (input) => {
                    if (input.trim() === "") {
                        return `Invalid Input.`;
                    }
                    else {
                        return true;
                    }
                },
            },
            {
                type: "input",
                name: "roleTitle",
                message: "Please Enter Role Name: ",
                validate: (input) => {
                    if (input.trim() === "") {
                        return `Invalid Input.`;
                    }
                    else {
                        return true;
                    }
                },
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Please Enter Role Salary(Per Annum): ",
                validate: (input) => {
                    if (input === 0 && !isNaN(input)) {
                        return `Invalid Input.`;
                    }
                    else {
                        return true;
                    }
                },
            },
        ];
        while (loopPrompt) {
            const answer = await inquirer.prompt(promptQues);
            const { roleDepartment, roleTitle, roleSalary } = answer;
            const match = await pool.query(`SELECT id FROM department WHERE name = $1`, [roleDepartment]);
            if (match.rowCount == 0) {
                console.log(`Department ${roleDepartment} does not exists.`);
                return;
            }
            else {
                const depId = match.rows[0].id;
                await pool.query(`INSERT INTO role(title,salary,department_id) VALUES ($1, $2, $3)`, [`${roleTitle}`, `${roleSalary}`, `${depId}`]);
                console.log(`${answer.roleTitle} added to Role list`);
                const disNewRole = await pool.query(`SELECT * FROM role`);
                console.table(disNewRole.rows);
            }
            loopPrompt = false;
        }
    }
    async addEmp() {
        let loopPrompt = true;
        const promptQues = [
            {
                input: "input",
                name: "fullName",
                message: "Enter Employees Full Name: ",
                validate: (input) => {
                    if (input.trim() === "") {
                        return `Invalid Input.`;
                    }
                    else {
                        return true;
                    }
                },
            },
            {
                input: "input",
                name: "role",
                message: "Enter Employees Role Title: ",
                validate: (input) => {
                    if (input.trim() === "") {
                        return `Invalid Input.`;
                    }
                    else {
                        return true;
                    }
                },
            },
            {
                input: "input",
                name: "managerName",
                message: "Enter Managers Full Name: ",
                validate: (input) => {
                    if (input.trim() === "") {
                        return `Invalid Input.`;
                    }
                    else {
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
            if (firstName.trim() === manFirstName.trim() &&
                lastName.trim() === manLastName.trim()) {
                // if employees first and last name matches the manager first and last name then he is the manager so his manager id is null.
                // getting role id by using and matching role title.
                const roleResult = await pool.query("SELECT id FROM role WHERE title = $1", [`${role.trim()}`]);
                const roleId = roleResult.rows[0].id;
                // using log to check the values being passed manId does not exist for this scenario
                await pool.query("INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ($1, $2, $3, NULL)", [`${firstName}`, `${lastName}`, `${roleId}`]);
                loopPrompt = false;
            }
            else {
                // getting manager emp id by using his name
                const manResult = await pool.query("SELECT id FROM employee WHERE first_name = $1 AND last_name = $2", [`${manFirstName}`, `${manLastName}`]);
                // getting role id by using and matching role title.
                const empRole = answer.role.trim();
                const roleResult = await pool.query("SELECT id FROM role WHERE title = $1", [`${empRole}`]);
                const roleId = roleResult.rows[0].id;
                const manId = manResult.rows[0].id;
                // using log to check the values being passed
                console.log(`first name: ${firstName} last name: ${lastName} role id:${roleId} manager id:${manId}`);
                await pool.query("INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ($1, $2, $3, $4)", [`${firstName}`, `${lastName}`, `${roleId}`, `${manId}`]);
                loopPrompt = false;
            }
        }
    }
    async typeOfAction(verb) {
        switch (verb) {
            case "View All Departments":
                await this.viewAllDep();
                break;
            case "View All Roles":
                await this.viewAllRoles();
                break;
            case "View All Employees":
                await this.viewAllEmps();
                break;
            case "Add a Department":
                await critFunc.addDepartment();
                break;
            case "Add a Role":
                await this.addRole();
                break;
            case "Add an Employee":
                await this.addEmp();
                break;
            case "Update an Employee Role":
                console.log(`update an emp role`);
                break;
        }
    }
}
const crud = new httpVerbs();
export default crud;
