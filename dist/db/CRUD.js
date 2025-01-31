// async await keywords to be used from the start and till very end of the link to have it execute properly, if not used data will not persist even though its being displayed but it will vanish as soon as next prompt is used.ex: from prompt till data is fetched async await is being applied to every function and step which returns or fetches or logs that data.
// import cTable from 'console.table';
import { pool, connectToDb } from './connection.js';
await connectToDb();
class httpVerbs {
    async action(verb) {
        await this.typeOfAction(verb);
        // console.log(`type of query value: ${typeOfQuery}`);
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
    async typeOfAction(verb) {
        switch (verb) {
            case 'View All Departments':
                await this.viewAllDep();
                break;
            case 'View All Roles':
                await this.viewAllRoles();
                break;
            case 'View All Employees':
                await this.viewAllEmps();
                break;
            case 'Add a Department':
                console.log(`add a dep`);
                break;
            case 'Add a Role':
                console.log(`add a role`);
                break;
            case 'Add an Employee':
                console.log(`add an emp`);
                break;
            case 'Update an Employee Role':
                console.log(`update an emp role`);
                break;
        }
    }
}
const crud = new httpVerbs();
export default crud;
