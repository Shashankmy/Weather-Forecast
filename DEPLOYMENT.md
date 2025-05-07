# Deployment Guide

This document provides instructions for deploying this Weather Forecast Web Application to various platforms.

## Prerequisites

Before deploying, make sure you have:

1. Created an [OpenWeatherMap API key](https://openweathermap.org/api)
2. Set up a PostgreSQL database
3. Built the project successfully locally

## Prepare for Deployment

### 1. Environment Variables

Make sure you have the following environment variables set in your deployment environment:

```
DATABASE_URL=your_postgresql_connection_string
OPENWEATHERMAP_API_KEY=your_api_key
```

### 2. Database Setup

Make sure your database is ready with the schema by running:

```bash
npm run db:push
```

### 3. Build the Project

Build the production version of the project:

```bash
npm run build
```

## Deployment Options

### GitHub Pages

GitHub Pages does not support server-side rendering or server APIs. For a full-stack application like this, use one of the options below instead.

### GitHub Repository Setup

1. Create a new repository on GitHub
2. Initialize git in your local project (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect to your GitHub repository:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

### Vercel Deployment

1. Push your code to GitHub using the instructions above
2. Create an account on [Vercel](https://vercel.com)
3. Connect your GitHub account to Vercel
4. Import your repository from GitHub
5. Set up environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `OPENWEATHERMAP_API_KEY`
6. Deploy the project

### Netlify Deployment

1. Push your code to GitHub using the instructions above
2. Create an account on [Netlify](https://netlify.com)
3. Connect your GitHub account to Netlify
4. Import your repository from GitHub
5. Set the build command to `npm run build`
6. Set the publish directory to `dist`
7. Add environment variables in the Netlify dashboard:
   - `DATABASE_URL`
   - `OPENWEATHERMAP_API_KEY`
8. Deploy the project

### Railway Deployment

1. Push your code to GitHub using the instructions above
2. Create an account on [Railway](https://railway.app)
3. Start a new project and select "Deploy from GitHub repo"
4. Connect your GitHub account and select your repository
5. Add a PostgreSQL database to your project
6. Add environment variables:
   - `OPENWEATHERMAP_API_KEY`
7. Deploy the project

### Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
3. Add the PostgreSQL add-on:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```
4. Set environment variables:
   ```bash
   heroku config:set OPENWEATHERMAP_API_KEY=your_api_key
   ```
5. Push to Heroku:
   ```bash
   git push heroku main
   ```

## Continuous Deployment

For a CI/CD workflow, you can use GitHub Actions to automatically deploy your application when you push changes to the main branch.

Create a `.github/workflows/deploy.yml` file with appropriate deployment steps for your target platform.

## Troubleshooting

If you encounter issues during deployment:

1. Check that all environment variables are correctly set
2. Verify database connection works (try connecting manually)
3. Check build logs for any errors
4. Ensure the Node.js version on your deployment platform is compatible (v18+ recommended)
5. Verify API keys are active and have proper permissions