import inquirer from 'inquirer';
import crud from './db/simpleFunctions.js';

// interface to keep data from being implicit any type
interface inq {
    action:string;
}

class Cli{
    
    // async function to pass action to CRUD.js with await to finish fetching sql queries
    async options():Promise<void>{

        // storing questions in an array for maintainin code readability
        const ques:string[] = [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ];
        const promptObj = {
            type:'list',
            message:'Choose a Task:',
            name:'action',
            choices:ques
        }

        // loopPrompt = true keeps prompting user for choices until they select exit which changes the value to false hence terminating the process.
        let loopPrompt = true;
        while (loopPrompt) {
            const data:inq = await inquirer
            .prompt([promptObj]);
                if (data.action !== 'Exit') {
                    await crud.action(data.action);
                } else {
                    console.log(`Task Terminated`);
                    loopPrompt = false;
                }

        }
    }
}
const cc = new Cli();
cc.options();