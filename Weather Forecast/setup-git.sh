#!/bin/bash

# Initialize a new git repository
git init

# Add all files to the repository
git add .

# Create the initial commit
git commit -m "Initial commit"

# Instructions for connecting to GitHub
echo ""
echo "Repository initialized! To connect to GitHub:"
echo "1. Create a new repository on GitHub"
echo "2. Run the following commands:"
echo "   git remote add origin https://github.com/yourusername/your-repo-name.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Don't forget to add your environment variables to GitHub Secrets for CI/CD!"