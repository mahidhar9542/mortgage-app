#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up Quick Close Mortgage Application...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "❌ Node.js is not installed. Please install Node.js 16.x or later and try again."
    echo -e "   Download it from: ${GREEN}https://nodejs.org/${NC}"
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm -v)
echo -e "✓ Found Node.js $(node -v) and npm $NPM_VERSION"

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}
npm install

# Check if .env file exists
if [ ! -f .env.local ]; then
    echo -e "\n${YELLOW}🔧 Creating .env.local file...${NC}"
    
    # Generate a random secret for NextAuth
    AUTH_SECRET=$(openssl rand -base64 32)
    
    # Create .env.local with default values
    cat > .env.local <<EOL
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/mortgage-app

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$AUTH_SECRET

# Email Configuration
EMAIL_FROM=noreply@quickclosemortgage.com

# SMTP Configuration (for production)
# SMTP_HOST=smtp.your-email-provider.com
# SMTP_PORT=587
# SMTP_SECURE=false # true for 465, false for other ports
# SMTP_USER=your-email@example.com
# SMTP_PASSWORD=your-email-password
EOL
    
    echo -e "✓ Created .env.local file with default configuration"
else
    echo -e "✓ .env.local already exists, skipping creation"
fi

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null; then
    echo -e "\n${YELLOW}⚠️  MongoDB is not installed or not in PATH.${NC}"
    echo -e "   Please install MongoDB Community Edition from: ${GREEN}https://www.mongodb.com/try/download/community${NC}"
    echo -e "   Or use a cloud MongoDB service like MongoDB Atlas."
else
    # Try to connect to MongoDB
    if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo -e "\n✓ MongoDB is running"
    else
        echo -e "\n${YELLOW}⚠️  MongoDB is installed but not running.${NC}"
        echo -e "   Please start MongoDB and run this script again."
    fi
fi

# Provide next steps
echo -e "\n${GREEN}✅ Setup complete!${NC}\n"
echo -e "Next steps:"
echo -e "1. Review the configuration in ${YELLOW}.env.local${NC}"
echo -e "2. Start the development server:"
echo -e "   ${GREEN}npm run dev${NC}"
echo -e "3. Open ${GREEN}http://localhost:3000${NC} in your browser\n"
echo -e "For development, you can use Ethereal Email to test email functionality:"
echo -e "${GREEN}https://ethereal.email/${NC}\n"

exit 0
