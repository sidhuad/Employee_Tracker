// async await keywords to be used from the start and till very end of the link to have it execute properly, if not used data will not persist even though its being displayed but it will vanish as soon as next prompt is used.ex: from prompt till data is fetched async await is being applied to every function and step which returns or fetches or logs that data.
import inquirer from "inquirer";
import { pool, connectToDb } from "./connection.js";
import "./criticalFuctions.js";
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
    async viewEmpByManager() {
        // const managersNullId = await pool.query(`SELECT employee.first_name ||' '|| employee.last_name AS Manager FROM employee WHERE employee.manager_id IS NULL`);
        const managerNotNull = await pool.query(`SELECT DISTINCT manager.first_name ||' '|| manager.last_name AS manager FROM employee JOIN employee AS manager ON employee.manager_id = manager.id WHERE employee.manager_id IS NOT NULL `);
        // console.table(managerNotNull.rows);
        const manArray = [];
        managerNotNull.rows.forEach(element => {
            manArray.push(element.manager);
        });
        const promptQues = {
            type: "list",
            name: "managers",
            message: "Choose a Manager to view Employees: ",
            choices: [...manArray]
        };
        const answer = await inquirer.prompt([promptQues]);
        const firstName = answer.managers.split(' ')[0];
        const lastName = answer.managers.split(' ')[1];
        const managerId = await pool.query(`SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`, [`${firstName}`, `${lastName}`]);
        const empByManagers = await pool.query(`SELECT employee.first_name ||' '||employee.last_name AS Employee_Names, role.title AS Title, manager.first_name ||' '|| manager.last_name AS Manager_Name FROM employee JOIN role ON employee.role_id = role.id JOIN employee AS manager ON employee.manager_id = manager.id WHERE employee.manager_id = $1`, [`${managerId.rows[0].id}`]);
        if (empByManagers.rows.length == 0) {
            console.log(`No Managers Found`);
        }
        else {
            console.table(empByManagers.rows);
        }
    }
    // view all employees by department
    async viewEmpByDep() {
        const allDep = await pool.query(`SELECT name FROM department`);
        const depArray = [];
        allDep.rows.forEach(element => {
            depArray.push(element.name);
        });
        const promptQues = {
            type: 'list',
            name: 'departments',
            message: 'View Employees By Departments: ',
            choices: [...depArray]
        };
        const answer = await inquirer.prompt([promptQues]);
        const depName = answer.departments;
        const disp = await pool.query(`SELECT employee.first_name ||' '||employee.last_name AS Employee_Names, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = $1 `, [`${depName}`]);
        console.table(disp.rows);
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
                await critFunc.addRole();
                break;
            case "Add an Employee":
                await critFunc.addEmp();
                break;
            case "Update an Employee Role":
                await critFunc.updateEmpRole();
                break;
            case "View Employee by Manager":
                await this.viewEmpByManager();
                break;
            case "View Employee by Department":
                await this.viewEmpByDep();
                break;
            case "Update Employee Managers":
                await critFunc.updateEmpManager();
                break;
            case "Delete Departments, Roles, Employees":
                await critFunc.delDepRoleEmp();
                break;
            case "View Total Utilized Budget of a Department":
                await critFunc.departmentBudget();
                break;
        }
    }
}
export default new httpVerbs();
