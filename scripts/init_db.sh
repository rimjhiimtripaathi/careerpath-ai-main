#!/bin/bash

# Database initialization script

echo "Initializing CareerPath AI database..."

cd backend

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found. Please run setup-dev.sh first."
    exit 1
fi

# Initialize database
python -c "
from app.database.init_db import init_db
init_db()
print('Database initialized successfully!')
"

echo "Database initialization complete!"