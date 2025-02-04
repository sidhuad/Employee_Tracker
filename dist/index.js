import inquirer from 'inquirer';
import crud from './db/simpleFunctions.js';
class Cli {
    // async function to pass action to CRUD.js with await to finish fetching sql queries
    async options() {
        // storing questions in an array for maintainin code readability
        const ques = [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'View Employee by Manager',
            'View Employee by Department',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Update Employee Managers',
            'Delete Departments, Roles, Employees',
            'View Total Utilized Budget of a Department',
            'Exit'
        ];
        const promptObj = {
            type: 'list',
            message: 'Choose a Task:',
            name: 'action',
            choices: ques
        };
        // loopPrompt = true keeps prompting user for choices until they select exit which changes the value to false hence terminating the process.
        let loopPrompt = true;
        while (loopPrompt) {
            const data = await inquirer
                .prompt([promptObj]);
            if (data.action !== 'Exit') {
                await crud.action(data.action);
            }
            else {
                console.log(`Task Terminated`);
                loopPrompt = false;
            }
        }
    }
}
const cc = new Cli();
cc.options();
