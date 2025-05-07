# Deployment Guide

This document provides instructions for deploying the Weather Forecast Web Application to various hosting platforms.

## Preparing for Deployment

1. Run the prepare-deploy script to create a deployment-ready version of the project:
   ```
   ./prepare-deploy.sh
   ```

2. This will create a `deploy` directory containing all the necessary files, excluding development-only files.

## Environment Variables

Ensure the following environment variables are set on your hosting platform:

- `DATABASE_URL`: Connection string for PostgreSQL database
- `OPENWEATHERMAP_API_KEY`: Your API key for OpenWeatherMap

## Deployment Options

### Option 1: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to the deploy directory: `cd deploy`
3. Run: `vercel` and follow the prompts
4. Set environment variables in the Vercel dashboard

### Option 2: Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Navigate to the deploy directory: `cd deploy`
3. Run: `netlify deploy`
4. Set environment variables in the Netlify dashboard

### Option 3: Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Navigate to the deploy directory: `cd deploy`
3. Log in: `railway login`
4. Deploy: `railway up`
5. Set environment variables in the Railway dashboard

### Option 4: Render

1. Create a new Web Service in the Render dashboard
2. Connect to your deployment directory
3. Set build command: `npm run build`
4. Set start command: `npm run start`
5. Add environment variables in the Render dashboard

## Database Setup

For platforms that support PostgreSQL:

1. Create a PostgreSQL database instance
2. Set the `DATABASE_URL` environment variable
3. On first deployment, the application will automatically create the required database tables

## Post-Deployment Verification

After deployment, verify:

1. The application loads properly
2. Weather data can be fetched
3. Search functionality works
4. City details are displayed correctly

## Troubleshooting

- If weather data doesn't load, check that the `OPENWEATHERMAP_API_KEY` is correctly set
- If database errors occur, verify the `DATABASE_URL` is correct and the database is accessible
- For build errors, check the deployment logs for specific error messages