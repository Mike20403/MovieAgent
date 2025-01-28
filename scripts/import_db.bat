@echo off
REM Usage: import_db.bat <database_name> <username> <password>
IF "%~1"=="" (
  echo Usage: %0 ^<database_name^> ^<username^> ^<password^>
  exit /b 1
)
IF "%~2"=="" (
  echo Usage: %0 ^<database_name^> ^<username^> ^<password^>
  exit /b 1
)
IF "%~3"=="" (
  echo Usage: %0 ^<database_name^> ^<username^> ^<password^>
  exit /b 1
)

SET DATABASE_NAME=%~1
SET USERNAME=%~2
SET PASSWORD=%~3
SET SQL_FILE=chatapp_database.sql

IF NOT EXIST "%SQL_FILE%" (
  echo Error: SQL file "%SQL_FILE%" not found in the current directory.
  exit /b 1
)

echo Importing SQL file into database "%DATABASE_NAME%"...
SET PGPASSWORD=%PASSWORD%
psql -U %USERNAME% -d %DATABASE_NAME% -f %SQL_FILE%

IF %ERRORLEVEL% EQU 0 (
  echo Database imported successfully!
) ELSE (
  echo Error occurred during import.
)

REM Clear the password variable for security
SET PGPASSWORD=
