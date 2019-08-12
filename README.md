// Set up the postgresql database

createdb flatwhite
psql flatwhite
CREATE USER flatwhite_user;

ALTER ROLE flatwhite_user SET client_encoding TO 'utf8';
ALTER ROLE flatwhite_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE flatwhite_user SET timezone TO 'UTC';
ALTER USER flatwhite_user WITH PASSWORD '12345';
ALTER USER flatwhite_user CREATEDB;
ALTER USER flatwhite_user SUPERUSER;

GRANT ALL PRIVILEGES ON DATABASE flatwhite TO flatwhite_user;

Authentication
Checklist (cross reference with sequelize)
[✔️] Add auth router
