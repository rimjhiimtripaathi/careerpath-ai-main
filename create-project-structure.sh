#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="careerpath-ai"

echo -e "${BLUE}🚀 Creating CareerPath AI Project Structure...${NC}"

# Create project root directory
mkdir -p $PROJECT_ROOT
cd $PROJECT_ROOT

echo -e "${GREEN}✅ Created project root: $PROJECT_ROOT${NC}"

# Create directory structure function
create_dir() {
    mkdir -p "$1"
    echo -e "${GREEN}✅ Created: $1${NC}"
}

create_file() {
    touch "$1"
    echo -e "${GREEN}✅ Created: $1${NC}"
}

# Create main directories
echo -e "${YELLOW}📁 Creating main directories...${NC}"
create_dir "frontend"
create_dir "backend"
create_dir "docs/api"
create_dir "docs/setup"
create_dir "docs/architecture"
create_dir "scripts"
create_dir "uploads/videos"
create_dir "uploads/documents"

# Frontend structure
echo -e "${YELLOW}📁 Creating Frontend structure...${NC}"
cd frontend

# Public directory
create_dir "public"

# Source directory and subdirectories
create_dir "src/components/Auth"
create_dir "src/components/Dashboard"
create_dir "src/components/Assessments/AssessmentSession"
create_dir "src/components/Common"
create_dir "src/components/Layout"
create_dir "src/contexts"
create_dir "src/services"
create_dir "src/hooks"
create_dir "src/utils"
create_dir "src/pages"
create_dir "src/styles/components"
create_dir "src/styles/layout"
create_dir "src/routes"

cd ..

# Backend structure
echo -e "${YELLOW}📁 Creating Backend structure...${NC}"
cd backend

# Main app structure
create_dir "app/database"
create_dir "app/models"
create_dir "app/schemas"
create_dir "app/routes"
create_dir "app/services"
create_dir "app/utils"
create_dir "app/middleware"
create_dir "app/config"

# Tests directory
create_dir "tests"

cd ..

# Create key files
echo -e "${YELLOW}📄 Creating key configuration files...${NC}"

# Root level files
create_file ".gitignore"
create_file "README.md"
create_file "docker-compose.yml"

# Frontend files
cd frontend

# Public files
create_file "public/index.html"
create_file "public/favicon.ico"
create_file "public/manifest.json"

# Source files
create_file "src/App.js"
create_file "src/App.css"
create_file "src/index.js"

# Component files
create_file "src/components/Auth/Login.js"
create_file "src/components/Auth/Register.js"
create_file "src/components/Auth/Auth.css"
create_file "src/components/Dashboard/Dashboard.js"
create_file "src/components/Dashboard/UserProfile.js"
create_file "src/components/Dashboard/Dashboard.css"
create_file "src/components/Assessments/AssessmentPortal.js"
create_file "src/components/Assessments/AssessmentSession/AssessmentSession.js"
create_file "src/components/Assessments/AssessmentSession/QuestionRenderer.js"
create_file "src/components/Assessments/AssessmentSession/WebcamRecorder.js"
create_file "src/components/Assessments/AssessmentSession/Session.css"
create_file "src/components/Assessments/AssessmentResults.js"
create_file "src/components/Common/Header.js"
create_file "src/components/Common/Footer.js"
create_file "src/components/Common/LoadingSpinner.js"
create_file "src/components/Common/ErrorBoundary.js"
create_file "src/components/Common/ProtectedRoute.js"
create_file "src/components/Layout/MainLayout.js"
create_file "src/components/Layout/AuthLayout.js"

# Context files
create_file "src/contexts/AuthContext.js"
create_file "src/contexts/AssessmentContext.js"
create_file "src/contexts/index.js"

# Service files
create_file "src/services/api.js"
create_file "src/services/authService.js"
create_file "src/services/assessmentService.js"
create_file "src/services/analysisService.js"

# Hook files
create_file "src/hooks/useAuth.js"
create_file "src/hooks/useAssessments.js"
create_file "src/hooks/useLocalStorage.js"
create_file "src/hooks/useWebcam.js"

# Utility files
create_file "src/utils/constants.js"
create_file "src/utils/helpers.js"
create_file "src/utils/validation.js"
create_file "src/utils/storage.js"

# Page files
create_file "src/pages/LoginPage.js"
create_file "src/pages/RegisterPage.js"
create_file "src/pages/DashboardPage.js"
create_file "src/pages/ProfilePage.js"
create_file "src/pages/AssessmentPage.js"
create_file "src/pages/ResultsPage.js"

# Style files
create_file "src/styles/globals.css"
create_file "src/styles/variables.css"
create_file "src/styles/components/auth.css"
create_file "src/styles/components/dashboard.css"
create_file "src/styles/components/assessments.css"
create_file "src/styles/layout/header.css"
create_file "src/styles/layout/layout.css"

# Route files
create_file "src/routes/AppRoutes.js"
create_file "src/routes/routes.js"

# Package files
create_file "package.json"
create_file "package-lock.json"

cd ..

# Backend files
cd backend

# Main app files
create_file "app/__init__.py"
create_file "app/main.py"

# Database files
create_file "app/database/__init__.py"
create_file "app/database/database.py"
create_file "app/database/init_db.py"

# Model files
create_file "app/models/__init__.py"
create_file "app/models/user_models.py"
create_file "app/models/assessment_models.py"
create_file "app/models/analysis_models.py"
create_file "app/models/base.py"

# Schema files
create_file "app/schemas/__init__.py"
create_file "app/schemas/auth_schemas.py"
create_file "app/schemas/user_schemas.py"
create_file "app/schemas/assessment_schemas.py"
create_file "app/schemas/analysis_schemas.py"

# Route files
create_file "app/routes/__init__.py"
create_file "app/routes/auth.py"
create_file "app/routes/users.py"
create_file "app/routes/assessments.py"
create_file "app/routes/analysis.py"
create_file "app/routes/dashboard.py"

# Service files
create_file "app/services/__init__.py"
create_file "app/services/auth_service.py"
create_file "app/services/user_service.py"
create_file "app/services/assessment_service.py"
create_file "app/services/analysis_service.py"
create_file "app/services/prediction_service.py"

# Utility files
create_file "app/utils/__init__.py"
create_file "app/utils/auth.py"
create_file "app/utils/security.py"
create_file "app/utils/file_handlers.py"
create_file "app/utils/mock_analyzers.py"
create_file "app/utils/constants.py"

# Middleware files
create_file "app/middleware/__init__.py"
create_file "app/middleware/auth_middleware.py"
create_file "app/middleware/cors.py"

# Config files
create_file "app/config/__init__.py"
create_file "app/config/config.py"
create_file "app/config/environment.py"

# Test files
create_file "tests/__init__.py"
create_file "tests/test_auth.py"
create_file "tests/test_assessments.py"
create_file "tests/test_analysis.py"
create_file "tests/conftest.py"

# Backend configuration files
create_file "requirements.txt"
create_file "requirements-dev.txt"
create_file ".env.example"
create_file "Dockerfile"

cd ..

# Documentation files
echo -e "${YELLOW}📄 Creating documentation files...${NC}"
create_file "docs/api/endpoints.md"
create_file "docs/setup/installation.md"
create_file "docs/setup/development.md"
create_file "docs/architecture/system-design.md"
create_file "docs/architecture/database-schema.md"

# Script files
echo -e "${YELLOW}📄 Creating script files...${NC}"
create_file "scripts/deploy.sh"
create_file "scripts/init_db.sh"
create_file "scripts/backup.sh"
create_file "scripts/setup-dev.sh"

# Create .gitkeep files in empty directories
echo -e "${YELLOW}📄 Adding .gitkeep files...${NC}"
find . -type d -empty -exec touch {}/.gitkeep \;

cd ..

echo -e "${GREEN}🎉 Project structure created successfully!${NC}"
echo -e "${BLUE}📁 Total directories created: $(find $PROJECT_ROOT -type d | wc -l)${NC}"
echo -e "${BLUE}📄 Total files created: $(find $PROJECT_ROOT -type f | wc -l)${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "1. cd $PROJECT_ROOT"
echo -e "2. Review and customize the generated files"
echo -e "3. Run 'chmod +x scripts/*.sh' to make scripts executable"
echo -e "4. Follow setup instructions in docs/setup/installation.md"
echo ""
echo -e "${GREEN}🚀 Happy coding!${NC}"