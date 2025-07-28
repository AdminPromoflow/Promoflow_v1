




/*Create database*/
CREATE DATABASE IF NOT EXISTS u273173398_promoflow;

/*Delete database*/
DROP DATABASE u273173398_promoflow;

/*Create users*/
CREATE USER 'u273173398_Ian'@'localhost' IDENTIFIED BY 'IanSail2023';

/*See all users*/
SELECT * FROM mysql.user;

/*Permission of the user*/
GRANT SELECT ON *.* TO 'u273173398_Ian'@'localhost';
FLUSH PRIVILEGES;

/*Change users password*/
ALTER USER 'u273173398_Ian'@'localhost' IDENTIFIED BY 'IanSail2023';
SET PASSWORD FOR 'u273173398_Ian'@'localhost' = PASSWORD('IanSail2023');
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('IanSail2023');

/*Drop User*/
DROP USER ‘u273173398_Ian’@'localhost';
