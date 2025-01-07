-- SOURCE C:/Proiect/DeskBookingApp/desk_booking.sql;

/*#############################################################*/
/*        PART 1 - DROPPING AND RECREATING THE DATABASE        */
DROP DATABASE deskBookingDB;
CREATE DATABASE deskBookingDB;
USE deskBookingDB;
/*#############################################################*/


/*#############################################################*/
/*                 PART 2 - CREATING THE TABLES                */


CREATE TABLE tblDepartment(
    idDepartment INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    department VARCHAR(100) NOT NULL
);

CREATE TABLE tblEmployee(
    idEmployee INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    lastName VARCHAR(50) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    role ENUM ('Manager', 'Employee') NOT NULL,
    department INT NULL,
    CONSTRAINT fk_department FOREIGN KEY(department)
        REFERENCES tblDepartment(idDepartment) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tblAccount(
    idAccount INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(120) NULL UNIQUE,
    password VARCHAR(50) NULL,
    role ENUM ('User', 'Admin') NOT NULL,
    employee INT NULL,
    CONSTRAINT fk_employee FOREIGN KEY(employee)
        REFERENCES tblEmployee(idEmployee) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tblLocation(
    idLocation INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL
);

CREATE TABLE tblDesk(
    idDesk INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    deskNumber INT NOT NULL,
    location INT NOT NULL,
    CONSTRAINT fk_location FOREIGN KEY(location)
        REFERENCES tblLocation(idLocation) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tblBooking(
    idBooking INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    bookingDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    employee INT NOT NULL,
    desk INT NOT NULL,
    CONSTRAINT fk_employee_booking FOREIGN KEY(employee) 
        REFERENCES tblEmployee(idEmployee) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_desk_booking FOREIGN KEY(desk) 
        REFERENCES tblDesk(idDesk) ON DELETE CASCADE ON UPDATE CASCADE
);

/*#############################################################*/

DELIMITER //
CREATE TRIGGER ai_generate_email_pass AFTER INSERT ON tblEmployee
FOR EACH ROW
BEGIN
    DECLARE generated_email TEXT;
    DECLARE generated_password VARCHAR(16);
    DECLARE counter INT DEFAULT 0;

    -- Generate email
    SET generated_email = CONCAT(LOWER(NEW.firstName), '.', LOWER(NEW.lastName), '@myfirm.com');

    -- Check for duplicates and add a counter if needed
    WHILE EXISTS (
        SELECT 1 FROM tblAccount WHERE email = generated_email
    ) DO
        SET counter = counter + 1;
        SET generated_email = CONCAT(
            LOWER(NEW.firstName), '.', LOWER(NEW.lastName), counter, '@myfirm.com'
        );
    END WHILE;

    -- Generate unique password
    SET generated_password = CONCAT(
        UPPER(NEW.lastName),
        '123',
        SUBSTRING('!@#$%^&*', FLOOR(1 + (RAND() * 8)), 1)
    );

    -- Insert the associated account for the new employee
    INSERT INTO tblAccount(email, password, role, employee) VALUES
        (generated_email, generated_password, 'User', NEW.idEmployee);
END;
//

CREATE PROCEDURE InsertDesks()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE locCount INT DEFAULT 1;

    -- Insert desks for each location
    WHILE locCount <= (SELECT COUNT(*) FROM tblLocation) DO
        SET i = 1;
        WHILE i <= 40 DO
            INSERT INTO tblDesk(deskNumber, location) VALUES(i, locCount);
            SET i = i + 1;
        END WHILE;
        SET locCount = locCount + 1;
    END WHILE;
END;
//

CREATE PROCEDURE CheckAvailableDesks(
    IN bookingDate DATE,
    IN startTime TIME,
    IN endTime TIME
)
BEGIN
    SELECT d.idDesk, d.deskNumber, d.location
    FROM tblDesk d
    WHERE NOT EXISTS (
        SELECT 1
        FROM tblBooking b
        WHERE b.desk = d.idDesk
        AND b.bookingDate = bookingDate
        AND (
            (startTime < b.endTime AND endTime > b.startTime)
        )
    );
END;
//
DELIMITER ;


INSERT INTO tblDepartment (department) VALUES 
    ('HR'),
    ('Sales'),
    ('Project Management'),
    ('Quality Assurance'),
    ('Software Development'),
    ('IT Support'),
    ('DevOps');

INSERT INTO tblEmployee (lastName, firstName, role, department) VALUES
    -- HR
    ('Popescu', 'Andreea', 'Manager', 1),
    ('Ionescu', 'Daniel', 'Employee', 1),
    ('Georgescu', 'Elena', 'Employee', 1),
    ('Dumitru', 'Alexandra', 'Employee', 1),

    -- Sales
    ('Vasilescu', 'Radu', 'Manager', 2),
    ('Stan', 'Mihai', 'Employee', 2),
    ('Tudor', 'Florin', 'Employee', 2),
    ('Petrescu', 'Cristina', 'Employee', 2),
    ('Marinescu', 'Adrian', 'Employee', 2),

    -- Project Management
    ('Radulescu', 'Diana', 'Manager', 3),
    ('Iliescu', 'John', 'Employee', 3),
    ('Moraru', 'Sarah', 'Employee', 3),
    ('Stefan', 'Madalina', 'Employee', 3),
    ('Enache', 'George', 'Employee', 3),

    -- Quality Assurance
    ('Dragomir', 'Ioana', 'Manager', 4),
    ('Voinea', 'Emma', 'Employee', 4),
    ('Mihalache', 'James', 'Employee', 4),
    ('Filip', 'Maria', 'Employee', 4),
    ('Stanciu', 'Victor', 'Employee', 4),
    ('Gheorghe', 'Elisabeth', 'Employee', 4),
    ('Andrei', 'Michael', 'Employee', 4),
    ('Barbu', 'Amelia', 'Employee', 4),
    ('Chirila', 'Robert', 'Employee', 4),

    -- Software Development
    ('Stefanescu', 'Ioan', 'Manager', 5),
    ('Neagu', 'Chris', 'Employee', 5),
    ('Dima', 'Luca', 'Employee', 5),
    ('Pavel', 'Sophia', 'Employee', 5),
    ('Costache', 'Daniela', 'Employee', 5),
    ('Roman', 'David', 'Employee', 5),
    ('Alexandru', 'Gabriela', 'Employee', 5),

    -- IT Support
    ('Gherasim', 'Alex', 'Manager', 6),
    ('Marin', 'Cristian', 'Employee', 6),
    ('Anghel', 'Stefan', 'Employee', 6),
    ('Lupu', 'Anca', 'Employee', 6),

    -- DevOps
    ('Badea', 'Dan', 'Manager', 7),
    ('Florescu', 'Leon', 'Employee', 7),
    ('Sima', 'Andreea', 'Employee', 7),
    ('Ciobanu', 'Edward', 'Employee', 7),
    ('Oprea', 'Daniel', 'Employee', 7),
    ('Cristea', 'Sophia', 'Employee', 7),
    ('Rusu', 'Matthew', 'Employee', 7);

-- Populate tblLocation
INSERT INTO tblLocation (country, city) VALUES 
    ('Romania', 'Bucharest'),
    ('Romania', 'Cluj-Napoca'),
    ('Romania', 'Timisoara'),
    ('Germany', 'Berlin');

CALL InsertDesks();

INSERT INTO tblBooking(bookingDate, startTime, endTime, employee, desk) VALUES
    ('2025-01-23', '10:00:00', '15:00:00', 1, 1),
    ('2025-01-27', '09:00:00', '18:00:00', 1, 2),
    ('2025-01-28', '09:00:00', '15:00:00', 2, 1),
    ('2025-02-23', '10:00:00', '18:00:00', 2, 44),
    ('2025-01-21', '10:00:00', '15:00:00', 2, 4);

CALL CheckAvailableDesks('2025-01-23', '10:00:00', '15:00:00');