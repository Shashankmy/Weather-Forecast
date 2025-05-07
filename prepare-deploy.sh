#!/bin/bash

# Create a deployment directory
rm -rf deploy
mkdir -p deploy

# Copy all files except Git-related and other excluded files
echo "Copying project files to deployment directory..."

# First copy everything
cp -r ./* ./deploy/ 2>/dev/null || true

# Remove files/folders we don't want in deployment
echo "Removing unnecessary files from deployment directory..."
rm -rf deploy/.git deploy/.github deploy/.gitignore deploy/setup-git.sh 
rm -rf deploy/.upm deploy/.cache deploy/node_modules deploy/prepare-deploy.sh
rm -rf deploy/deploy

echo "Files prepared for deployment in the 'deploy' directory."
echo "Deployment directory size:"
du -sh deploy

echo ""
echo "To deploy, upload the contents of the 'deploy' directory to your chosen hosting platform."
echo "Remember to set up your environment variables, especially OPENWEATHERMAP_API_KEY."