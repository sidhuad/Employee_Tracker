-- inserting into department table
INSERT INTO department(name)
VALUES ('IT');

-- inserting data into role table
INSERT INTO role(title, salary, department_id)
VALUES
    ('Manager', 120000, 1),
    ('Developer', 90000, 1),
    ('Human Resource', 50000, 1);

-- inserting data into employee table, inserting manager
INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES
    ('John','Doe',1,NULL),
    ('Jane','Smith',2,1),
    ('Bob','Johnson',2,1),
    ('Alice','Williams',3,1);
