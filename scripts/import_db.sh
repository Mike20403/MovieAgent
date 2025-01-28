#!/bin/bash

# Usage: ./import_db.sh <database_name> <username> <password>

# Check if the required arguments are provided
if [ $# -lt 3 ]; then
  echo "Usage: $0 <database_name> <username> <password>"
  exit 1
fi

DATABASE_NAME=$1
USERNAME=$2
PASSWORD=$3
SQL_FILE="my_database_dump.sql"  # Replace with your actual dump file name

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: SQL file '$SQL_FILE' not found in the current directory."
  exit 1
fi

# Export the password for the PostgreSQL client
export PGPASSWORD=$PASSWORD

# Run the psql command to import the SQL file
echo "Importing SQL file into database '$DATABASE_NAME'..."
psql -U $USERNAME -d $DATABASE_NAME -f $SQL_FILE

# Check the status of the last command
if [ $? -eq 0 ]; then
  echo "Database imported successfully!"
else
  echo "Error occurred during import."
fi

# Unset the password for security
unset PGPASSWORD
