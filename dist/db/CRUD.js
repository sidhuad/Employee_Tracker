// async await keywords to be used from the start and till very end of the link to have it execute properly, if not used data will not persist even though its being displayed but it will vanish as soon as next prompt is used.ex: from prompt till data is fetched async await is being applied to every function and step which returns or fetches or logs that data.
// import cTable from 'console.table';
import inquirer from "inquirer";
import { pool, connectToDb } from "./connection.js";
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
        const result = await pool.query(`SELECT * FROM role`);
        console.table(result.rows);
    }
    async viewAllEmps() {
        const result = await pool.query(`SELECT * FROM employee`);
        console.table(result.rows);
    }
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
                const match = await pool.query(`SELECT name FROM department WHERE name = $1`, [answer.userInput]);
                if (match.rowCount != 0) {
                    console.log(`Department ${answer.userInput} already exists.`);
                }
                else {
                    await pool.query(`INSERT INTO department(name) VALUES ($1)`, [
                        `${answer.userInput}`,
                    ]);
                    console.log(`${answer.userInput} added to Department list`);
                    const disNewDep = await pool.query(`SELECT * FROM department WHERE name = $1`, [answer.userInput]);
                    console.table(disNewDep.rows);
                }
                loopPrompt = false;
            }
            else {
                console.log(`Please Enter A Valid Name!`);
            }
        }
    }
    async addRole() {
        let loopPrompt = true;
        const promptQues = [
            {
                type: "input",
                name: "roleDepartment",
                message: "Please Enter Department Name to add roles to: ",
            },
            {
                type: "input",
                name: "roleTitle",
                message: "Please Enter Role Name: ",
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Please Enter Role Salary(Per Annum): ",
            },
        ];
        while (loopPrompt) {
            const answer = await inquirer.prompt(promptQues);
            if (answer.roleDepartment &&
                answer.roleTitle &&
                answer.roleSalary &&
                isNaN(answer.roleDepartment) &&
                isNaN(answer.roleTitle) &&
                !isNaN(answer.roleSalary)) {
                const match = await pool.query(`SELECT id FROM department WHERE name = $1`, [answer.roleDepartment]);
                if (match.rowCount == 0) {
                    console.log(`Department ${answer.roleDepartment} does not exists.`);
                    return;
                }
                else {
                    const depId = match.rows[0].id;
                    await pool.query(`INSERT INTO role(title,salary,department_id) VALUES ($1, $2, $3)`, [`${answer.roleTitle}`, `${answer.roleSalary}`, `${depId}`]);
                    console.log(`${answer.roleTitle} added to Role list`);
                    const disNewRole = await pool.query(`SELECT * FROM role`);
                    console.table(disNewRole.rows);
                }
                loopPrompt = false;
            }
            else {
                console.log(`Please Enter A Valid Input!`);
            }
        }
    }
    async addEmp() {
        const promptQues = [
            {
                input: "input",
                name: "firstName",
                message: "Enter Employees First Name: ",
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
                name: "lastName",
                message: "Enter Employees Last Name: ",
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
        const answer = await inquirer.prompt(promptQues);
        const manName = answer.managerName.trim();
        //spliting managers full name to use in query as first and last name to accurately get his id
        const manFirstName = manName.split(" ")[0];
        const manLastName = manName.split(" ")[1];
        // user input new employees name
        const firstName = answer.firstName;
        const lastName = answer.lastName;
        if ((firstName.trim() === manFirstName.trim()) && (lastName.trim() === manLastName.trim())) {
            // if employees first and last name matches the manager first and last name then he is the manager so his manager id is null.
            // getting role id by using and matching role title.
            const empRole = answer.role.trim();
            const roleResult = await pool.query("SELECT id FROM role WHERE title = $1", [
                `${empRole}`,
            ]);
            const roleId = roleResult.rows[0].id;
            // using log to check the values being passed manId does not exist for this scenario
            await pool.query('INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ($1, $2, $3, NULL)', [`${firstName}`, `${lastName}`, `${roleId}`]);
            return;
        }
        else {
            // getting manager emp id by using his name
            const manResult = await pool.query("SELECT id FROM employee WHERE first_name = $1 AND last_name = $2", [`${manFirstName}`, `${manLastName}`]);
            // getting role id by using and matching role title.
            const empRole = answer.role.trim();
            const roleResult = await pool.query("SELECT id FROM role WHERE title = $1", [
                `${empRole}`,
            ]);
            const roleId = roleResult.rows[0].id;
            const manId = manResult.rows[0].id;
            // using log to check the values being passed
            console.log(`first name: ${firstName} last name: ${lastName} role id:${roleId} manager id:${manId}`);
            await pool.query('INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ($1, $2, $3, $4)', [`${firstName}`, `${lastName}`, `${roleId}`, `${manId}`]);
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
                await this.addDepartment();
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
