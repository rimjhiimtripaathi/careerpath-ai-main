#!/bin/bash

# Setup development environment script

echo "Setting up CareerPath AI development environment..."

# Check if Python and Node.js are installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is required but not installed. Please install Python 3.8+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js 14+"
    exit 1
fi

# Backend setup
echo "Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
python -c "from app.database.init_db import init_db; init_db()"

cd ..

# Frontend setup
echo "Setting up frontend..."
cd frontend

# Install frontend dependencies
npm install

cd ..

echo "Development environment setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && source venv/bin/activate && python app/main.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"