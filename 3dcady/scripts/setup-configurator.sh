#!/bin/bash

# Furniture Configurator Setup Script
# This script sets up the database and seeds the configurator data

echo "🚀 Setting up Furniture Configurator..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Generate Prisma Client
echo -e "${BLUE}Step 1: Generating Prisma Client...${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Prisma generate failed. Please check your schema.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Step 2: Run Database Migration
echo -e "${BLUE}Step 2: Running database migration...${NC}"
npx prisma migrate dev --name add_configurator_models
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Migration failed. Please check your database connection.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Database migrated${NC}"
echo ""

# Step 3: Seed Configurator Data
echo -e "${BLUE}Step 3: Seeding configurator data...${NC}"
npx ts-node prisma/seed-configurator.ts
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Seeding failed. Please check the seed script.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Configurator data seeded${NC}"
echo ""

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Navigate to http://localhost:3000/configurator"
echo "3. Start configuring your furniture!"
echo ""
