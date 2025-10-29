#!/bin/bash

echo "🚀 PDF Scraper - Database Setup"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please update the DATABASE_URL in .env file before continuing"
    echo "   You can get a free PostgreSQL database from:"
    echo "   - Supabase: https://supabase.com"
    echo "   - Railway: https://railway.app"
    echo "   - Render: https://render.com"
    echo ""
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=\"postgresql://" .env; then
    echo "❌ DATABASE_URL not properly configured in .env"
    echo "⚠️  Please update the DATABASE_URL in .env file"
    exit 1
fi

echo "📦 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

echo "✅ Prisma Client generated"
echo ""

echo "🗄️  Pushing schema to database..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push schema to database"
    echo "⚠️  Please check your DATABASE_URL and database connection"
    exit 1
fi

echo "✅ Database schema created successfully"
echo ""
echo "🎉 Setup complete! You can now run:"
echo "   npm run dev"
echo ""
echo "📊 To view your database, run:"
echo "   npx prisma studio"
