
# Employee Tracker

![Static Badge](https://img.shields.io/badge/License-MIT-green)

## Description

### Motivation 
The motivation behind building the Employee Tracker was to create a solution for managing and keeping track of employee records, roles, and departments in an organization. As businesses grow, keeping track of employees manually can become complex, error-prone, and time-consuming. This project provides a user-friendly and efficient way to manage employee information, their roles, and department associations in a streamlined manner.
### Why build This Project 
This project was built to simplify the management of employee data by offering an easy-to-use interface for HR teams or managers. It allows you to:
- Add, update, and delete employee records.
- View employees by department or role. 
- Manage roles and departments efficiently.
- Track relationships between employees and their managers.
Additionally, it demonstrates how to implement PostgreSQL for data storage, how to use TypeScript for better code maintainability, and how to structure an interactive CLI-based application with Inquirer.
### What problem's did it solve
- Complex Employee Management: Manually keeping track of employees, departments, and roles is prone to errors and inefficiency. The Employee Tracker automates this and provides clear, organized management.
- Lack of Interaction in Traditional Systems: Many existing HR management tools are either too complex or require a lot of manual work. This CLI-based solution is simple, intuitive, and reduces administrative overhead.
- Database Management: The system eliminates the risk of data redundancy by storing employee, role, and department information in a relational database, with well-defined relationships between them.
### Lesson's Learned
- Database Relationships: I learned how to model relationships in a relational database—how to create proper foreign keys between tables like employees, roles, and departments.
- TypeScript Best Practices: Working with TypeScript taught me about strong typing and the importance of defining interfaces for structured data, improving code quality and maintainability.
- CLI Interaction: Using Inquirer to create dynamic, interactive command-line prompts was a valuable experience in building CLI tools with user-friendly interfaces.
- PostgreSQL Setup: I became more familiar with configuring PostgreSQL, establishing connections, and running SQL queries to create, read, update, and delete data.
### What makes your project stand-out 
- CLI functionality: It’s not just a web app—this is an interactive command-line tool, providing a fast and responsive way to manage data.
- Real-world Application: The system is designed around managing real-world business entities, making it useful for any organization that wants to track employee roles and departments.
- Relational Database Design: It efficiently handles relationships between employees, roles, and departments using PostgreSQL, demonstrating a practical use of database management.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)
- [How to Contribute](#how-to-contribute)
- [Tests](#tests)
- [Questions](#questions)
- [Links](#links)

## Installation
- Clone the repository
```
git clone https://github.com/sidhuad/employee_tracker.git 
cd employee_tracker
```
- Install the necessay dependencies
```
npm install
```
- Set up environment variables
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=employee_tracker
```
- Create and set up the PostgreSQL database (ensure PostgreSQL is running on your machine)
```
Run the provided SQL scripts to create the necessary tables (roles, employees, departments).
Optionally, you can use a tool like pgAdmin to interact with your database.
```
- Run the application
```
npm run start
```

## Usage
Once the app is running, you can interact with the system through a series of prompts:
- **View employees:** View employees by their department or role.
- **Add new records:** Add new employees, roles, or departments to the system.
- **Update employee records:** Modify roles, departments, or other details of an existing employee.
- **Delete records:** Remove employees, roles, or departments from the database.
The app uses a CLI interface, so it guides you through different operations using prompts for interaction.

## Credits
- **PostgreSQL:** Used for database storage and management.
- **Inquirer.js:** Used for creating the interactive command-line interface.
- **TypeScript:** Used for structured and typed code.
- **dotenv:** Used for storing environment variables like database connection details.

## License
A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code. https://choosealicense.com/licenses/mit/

## Features
- **View Employees by Department/Role:** Quickly filter employees based on their department or role.
- **Add New Employees, Roles, and Departments:** Easily input new data into the system.
- **Update Employee Information:** Edit existing employee details such as role or department.
- **Delete Records:** Remove any employee, role, or department from the system.
- **Interactive CLI:** Provides an intuitive, user-friendly command-line interface for managing employees.

## How to Contribute
1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Make your changes and commit them (git commit -am 'Add your feature').
4. Push to your branch (git push origin feature/your-feature).
5. Open a pull request and describe your changes.
Feel free to suggest improvements or new features, and I'll review them as soon as possible!

## Tests
To ensure the app is functioning correctly, I recommend testing each of the features, such as:
- Viewing employee records.
- Adding and editing employee information.
- Removing records from the database.
- Checking the database integrity after operations.
You can write unit tests for database operations using a testing library like Jest or Mocha if you wish to further improve the project.

## Questions
- For Further Questions and Bug reports Please reach out to me at Github [sidhuad](https://github.com/sidhuad) or email me at adarshsidhu83@gmail.com

## Links
[Video demo](https://www.loom.com/share/1655db2f1e9d4558be999fe24385728a?sid=cbbea2b1-a1a1-4b1d-8065-17c0d6fa1046)
[Github Repo](https://github.com/sidhuad/Employee_Tracker)