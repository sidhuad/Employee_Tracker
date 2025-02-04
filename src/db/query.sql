-- SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS departments, role.salary,employee.first_name AS manager
-- FROM department
-- LEFT JOIN role
-- ON department.id = role.department_id
-- JOIN employee
-- ON role.id = employee.role_id
-- LEFT JOIN employee AS manager
-- ON employee.id = employee.manager_id
-- WHERE employee.manager_id IS NULL;

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary,department.name, manager.first_name AS manager_first_name
-- FROM employee
-- JOIN role ON employee.role_id = role.id
-- JOIN department ON role.department_id = department.id
-- LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

-- SELECT role.title AS job_title, role.id AS role_id, department.name AS department FROM role JOIN department ON role.department_id = department.id;

-- SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id WHERE first_name = $1 AND last_name = $2

-- SELECT department.name FROM department JOIN role ON role.department_id = department.id WHERE title = 'Marketing Associate'

-- SELECT employee.manager_id, employee.first_name FROM employee JOIN role ON employee.role_id = role.id WHERE role.title = 'Developer';

SELECT DISTINCT manager_id, first_name FROM employee WHERE manager_id IS NOT NULL;