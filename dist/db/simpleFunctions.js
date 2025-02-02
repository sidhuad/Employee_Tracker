// async await keywords to be used from the start and till very end of the link to have it execute properly, if not used data will not persist even though its being displayed but it will vanish as soon as next prompt is used.ex: from prompt till data is fetched async await is being applied to every function and step which returns or fetches or logs that data.
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
                console.log(`update an emp role`);
                break;
        }
    }
}
export default new httpVerbs();
