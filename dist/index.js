import inquirer from 'inquirer';
import crud from './db/CRUD.js';
class Cli {
    // async function to pass action to CRUD.js with await to finish fetching sql queries
    async options() {
        // storing questions in an array for maintainin code readability
        const ques = [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ];
        // loopPrompt = true keeps prompting user for choices until they select exit which changes the value to false hence terminating the process.
        let loopPrompt = true;
        while (loopPrompt) {
            const data = await inquirer
                .prompt([
                {
                    type: 'list',
                    message: 'Choose a Task:',
                    name: 'action',
                    choices: ques,
                }
            ]);
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
