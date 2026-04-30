#!/bin/bash

# Script to download Geist font locally
# Run: bash scripts/download-fonts.sh

echo "📥 Downloading Geist font..."

# Create fonts directory
mkdir -p static/fonts/geist

# Download font files (weights 400, 500, 600, 700 - most commonly used)
curl -o static/fonts/geist/geist-400.ttf "https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOM4nQ.ttf"
curl -o static/fonts/geist/geist-500.ttf "https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RruM4nQ.ttf"
curl -o static/fonts/geist/geist-600.ttf "https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4nQ.ttf"
curl -o static/fonts/geist/geist-700.ttf "https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_Re-Q4nQ.ttf"

echo "✅ Fonts downloaded to static/fonts/geist/"
echo ""
echo "Next steps:"
echo "1. Update src/routes/layout.css to use local fonts"
echo "2. Remove Google Fonts link from src/app.html"
