# Define environment variables
$env:PGPASSWORD = 'khuonghcmus'

# Define variables
$USER = "postgres"
$DATABASE = "chatapp"
$CSV_FILE = "D:/React/PROJECTS/Chatbox/chat-box-ai/src/server/data/movies.csv"
$TABLE = "movie"

# Run the psql COPY command
$cmd = "psql -h localhost -U $USER -d $DATABASE -c `"COPY $TABLE(name, rating, runtime, genre, metascore, plot, directors, stars, votes, gross) FROM '$CSV_FILE' DELIMITER ',' CSV HEADER;`""

# Execute the command
Invoke-Expression -Command $cmd

# Check if the command was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Movies imported successfully!"
} else {
    Write-Host "Failed to import movies."
}

