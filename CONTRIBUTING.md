# Contributing to Weather Forecast Web Application

Thank you for considering contributing to this project! Here's how you can help.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/weather-forecast-app.git
   cd weather-forecast-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
5. Set up the database:
   ```bash
   npm run db:push
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Code Style and Guidelines

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Add comments for non-obvious code
- Ensure your code passes type checking (`npm run check`)

## Pull Request Process

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Commit your changes:
   ```bash
   git commit -m "Add feature X" 
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a Pull Request from your fork to the original repository

## Feature Requests and Bug Reports

- Use the GitHub Issues section to report bugs or suggest features
- For bugs, include steps to reproduce, expected behavior, and actual behavior
- For feature requests, describe the feature and its benefits

## Code of Conduct

- Be respectful and inclusive in your interactions
- Focus on constructive feedback
- Help create a positive community around the project

Thank you for your contribution!