#!/bin/bash

echo "🚀 AIMA Status Checker Setup"
echo "=========================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your credentials!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install chromium

# Test connectivity
echo ""
echo "🔍 Testing AIMA connectivity..."
npm run test

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your credentials"
echo "2. Configure a Portuguese proxy if not in Portugal"
echo "3. Test locally with: npm run test:scraper"
echo "4. Deploy to Vercel or use GitHub Actions"
echo ""
echo "For more information, see README.md"
