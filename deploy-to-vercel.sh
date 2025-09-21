#!/bin/bash

# Vercel API Deployment Script
# Usage: ./deploy-to-vercel.sh [VERCEL_TOKEN]

set -e

echo "🚀 Deploying to Vercel via API..."

# Check if Vercel token is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your Vercel token:"
    echo "Usage: ./deploy-to-vercel.sh YOUR_VERCEL_TOKEN"
    echo ""
    echo "To get your token:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Create a new token"
    echo "3. Run: ./deploy-to-vercel.sh YOUR_TOKEN"
    exit 1
fi

VERCEL_TOKEN="$1"
REPO_URL="https://github.com/ai-assistant-altsportsdata/frontend-league-owner-portal"

echo "📦 Creating deployment..."

# Create deployment using Vercel API
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "frontend-league-owner-portal",
    "gitSource": {
      "type": "github",
      "repo": "ai-assistant-altsportsdata/frontend-league-owner-portal",
      "ref": "main"
    },
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "devCommand": "npm run dev",
    "installCommand": "npm install"
  }' \
  | jq -r '.url // .error.message // .'

echo ""
echo "✅ Deployment initiated!"
echo "🌐 Your app will be available at: https://frontend-league-owner-portal.vercel.app"
echo "📊 Check deployment status at: https://vercel.com/dashboard"