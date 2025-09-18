CREATE DATABASE moneytransfer;
CREATE USER moneyuser WITH ENCRYPTED PASSWORD 'money_pass';
GRANT ALL PRIVILEGES ON DATABASE moneytransfer TO moneyuser;