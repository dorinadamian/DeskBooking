/*#############################################################*/
/*        PARTEA 1 - STERGEREA SI RECREAREA BAZEI DE DATE      */
DROP DATABASE deskBookingDB;
CREATE DATABASE deskBookingDB;
USE deskBookingDB;
/*#############################################################*/



/*#############################################################*/
/*                  PARTEA 2 - CREAREA TABELELOR              */


CREATE TABLE tblDepartament(
	idDepartament INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	departament VARCHAR(100) NOT NULL
);

CREATE TABLE tblAngajat(
	idAngajat INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nume VARCHAR(50) NOT NULL,
    prenume VARCHAR(50) NOT NULL,
    functia ENUM ('MANAGER', 'SUBORDONAT') NOT NULL,
    departament INT NULL,
    CONSTRAINT fk_departament FOREIGN KEY(departament)
        REFERENCES tblDepartament(idDepartament) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tblCont(
	idCont INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(120) NULL,
    parola VARCHAR(50) NULL,
    rol ENUM ('USER', 'ADMIN') NOT NULL,
    angajat INT NULL,
    CONSTRAINT fk_angajat FOREIGN KEY(angajat)
		REFERENCES tblAngajat(idAngajat) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tblBirou(
	idBirou INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    disponibilitate ENUM ('LIBER', 'OCUPAT') NOT NULL
);

CREATE TABLE tblRezervare(
	idRezervare INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    dataRezervare DATE NOT NULL,
    oraInceput TIME NOT NULL,
    oraSfarsit TIME NOT NULL,
    angajat INT NOT NULL,
    birou INT NOT NULL,
    CONSTRAINT fk_angajat_rezervare FOREIGN KEY(angajat) 
		REFERENCES tblAngajat(idAngajat) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_birou_rezervare FOREIGN KEY(birou) 
		REFERENCES tblBirou(idBirou) ON DELETE CASCADE ON UPDATE CASCADE
);

/*#############################################################*/

DELIMITER //
CREATE TRIGGER ai_generare_email_pass AFTER INSERT ON tblAngajat
FOR EACH ROW
BEGIN
    DECLARE email_generat TEXT;
    DECLARE parola_generata VARCHAR(16);

    -- Generare email
    SET email_generat = CONCAT(LOWER(NEW.prenume), '.', LOWER(NEW.nume), '@myfirm.com');

    -- Generare parola unica
    SET parola_generata = CONCAT(
        UPPER(NEW.nume),
        '123',
        SUBSTRING('!@#$%^&*', FLOOR(1 + (RAND() * 8)), 1)
    );

    -- Inserăm contul asociat noului angajat
    INSERT INTO tblCont(email, parola, rol, angajat) VALUES
        (email_generat, parola_generata, 'USER', NEW.idAngajat);
END;
//

CREATE PROCEDURE InsertBirouri()
BEGIN
    DECLARE i INT DEFAULT 1;

    WHILE i <= 50 DO
        INSERT INTO tblBirou(disponibilitate) VALUES('LIBER');
        SET i = i + 1;
    END WHILE;
END;
//

DELIMITER ;


INSERT INTO tblDepartament (departament) VALUES 
    ('HR'),
    ('Vanzari'),
    ('Project Management'),
    ('Quality Assurance'),
    ('Software Development'),
    ('IT Support'),
    ('DevOps');

INSERT INTO tblAngajat (nume, prenume, functia, departament) VALUES
    -- HR
    ('Popescu', 'Andreea', 'MANAGER', 1),
    ('Ionescu', 'Daniel', 'SUBORDONAT', 1),
    ('Georgescu', 'Elena', 'SUBORDONAT', 1),
    ('Dumitru', 'Alexandra', 'SUBORDONAT', 1),

    -- Vanzari
    ('Vasilescu', 'Radu', 'MANAGER', 2),
    ('Stan', 'Mihai', 'SUBORDONAT', 2),
    ('Tudor', 'Florin', 'SUBORDONAT', 2),
    ('Petrescu', 'Cristina', 'SUBORDONAT', 2),
    ('Marinescu', 'Adrian', 'SUBORDONAT', 2),

    -- Project Management
    ('Radulescu', 'Diana', 'MANAGER', 3),
    ('Iliescu', 'John', 'SUBORDONAT', 3),
    ('Moraru', 'Sarah', 'SUBORDONAT', 3),
    ('Stefan', 'Madalina', 'SUBORDONAT', 3),
    ('Enache', 'George', 'SUBORDONAT', 3),

    -- Quality Assurance
    ('Dragomir', 'Ioana', 'MANAGER', 4),
    ('Voinea', 'Emma', 'SUBORDONAT', 4),
    ('Mihalache', 'James', 'SUBORDONAT', 4),
    ('Filip', 'Maria', 'SUBORDONAT', 4),
    ('Stanciu', 'Victor', 'SUBORDONAT', 4),
    ('Gheorghe', 'Elisabeth', 'SUBORDONAT', 4),
    ('Andrei', 'Michael', 'SUBORDONAT', 4),
    ('Barbu', 'Amelia', 'SUBORDONAT', 4),
    ('Chirila', 'Robert', 'SUBORDONAT', 4),

    -- Software Development
    ('Stefanescu', 'Ioan', 'MANAGER', 5),
    ('Neagu', 'Chris', 'SUBORDONAT', 5),
    ('Dima', 'Luca', 'SUBORDONAT', 5),
    ('Pavel', 'Sophia', 'SUBORDONAT', 5),
    ('Costache', 'Daniela', 'SUBORDONAT', 5),
    ('Roman', 'David', 'SUBORDONAT', 5),
    ('Alexandru', 'Gabriela', 'SUBORDONAT', 5),

    -- IT Support
    ('Gherasim', 'Alex', 'MANAGER', 6),
    ('Marin', 'Cristian', 'SUBORDONAT', 6),
    ('Anghel', 'Stefan', 'SUBORDONAT', 6),
    ('Lupu', 'Anca', 'SUBORDONAT', 6),

    -- DevOps
    ('Badea', 'Dan', 'MANAGER', 7),
    ('Florescu', 'Leon', 'SUBORDONAT', 7),
    ('Sima', 'Andreea', 'SUBORDONAT', 7),
    ('Ciobanu', 'Edward', 'SUBORDONAT', 7),
    ('Oprea', 'Daniel', 'SUBORDONAT', 7),
    ('Cristea', 'Sophia', 'SUBORDONAT', 7),
    ('Rusu', 'Matthew', 'SUBORDONAT', 7);

CALL InsertBirouri();
