Here’s the final setup instruction, tailored to your project structure:

---

# Chatbox - Setup Guide

## Requirements

Before you begin, make sure you have the following installed:

1. **Node.js**: Download and install from [Node.js](https://nodejs.org/).
2. **PostgreSQL**: Install [PostgreSQL](https://www.postgresql.org/) and ensure the `psql` command-line tool is added to your system PATH.

---

## Installation

### 1. Clone the repository
Run the following commands in your terminal:
```bash
git clone https://github.com/Mike20403/MovieAgent.git
cd MovieAgent
```

---

### 2. Install dependencies
Run the following command to install the required Node.js packages:
```bash
npm install
```

---

### 3. Set up the database

1. Navigate to the `scripts` folder:
   ```bash
   cd scripts
   ```

2. Import the database using one of the provided scripts:

   - **For Linux/Mac**:
     Run the shell script:
     ```bash
     ./import_db.sh <database_name> <username> <password>
     ```
     Example:
     ```bash
     ./import_db.sh chatapp_db postgres mypassword
     ```

   - **For Windows**:
     Run the batch script:
     ```cmd
     import_db.bat <database_name> <username> <password>
     ```
     Example:
     ```cmd
     import_db.bat chatapp_db postgres mypassword
     ```

3. Verify the database:
   Open your PostgreSQL client and check that the `chatapp_database.sql` file has been imported successfully into the specified database.

4. Go back to the project root:
   ```bash
   cd ..
   ```

---

### 4. Set up environment variables
1. Create a `.env` file in the project root directory:
   ```bash
   touch .env
   ```

2. Add the following content to the `.env` file:
   ```plaintext
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
   ```
   Replace `<username>`, `<password>`, and `<database_name>` with your PostgreSQL credentials.

---

### 5. Run the development server
Start the development environment:
```bash
npm run dev
```

---

### 6. Build and start the production server
- To build the project:
  ```bash
  npm run build
  ```
- To start the production server:
  ```bash
  npm start
  ```

---

### Notes for Teachers

- The database SQL file is located in `scripts/chatapp_database.sql`.
- Use the `import_db.sh` script for Linux/Mac or `import_db.bat` for Windows to import the database easily.

If you encounter any issues, feel free to reach out for assistance! 🎉
