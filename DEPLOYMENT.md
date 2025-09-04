# Deployment Guide

This guide will help you deploy the English Learning Application to a production environment.

## Prerequisites

Before you begin, make sure you have:

1. A Supabase account and project
2. Node.js and npm installed
3. Git installed
4. A Heroku account (for free hosting)

## Backend Deployment

### 1. Deploy to Heroku

1. Install the Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   cd backend
   heroku create
   ```

4. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL="postgresql://postgres.zxaqgjmlqdyrkafjyvsa:Saves3*5@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public"
   heroku config:set SUPABASE_URL="https://zxaqgjmlqdyrkafjyvsa.supabase.co"
   heroku config:set SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YXFnam1scWR5cmthZmp5dnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTI0ODEsImV4cCI6MjA3MjUyODQ4MX0.KCdC7La3Fe_MQMuftpPYj0m-t_Ags0GBTv3PmTecanw"
   ```

5. Deploy the backend:
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

6. Open the app to get the URL:
   ```bash
   heroku open
   ```

### 2. Alternative: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the backend:
   ```bash
   cd backend
   vercel
   ```

4. Set environment variables in the Vercel dashboard:
   - DATABASE_URL
   - SUPABASE_URL
   - SUPABASE_KEY

## Frontend Deployment

### 1. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the frontend:
   ```bash
   cd ..
   vercel
   ```

4. Set environment variables in the Vercel dashboard:
   - REACT_APP_API_URL (your backend URL)
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_KEY

### 2. Alternative: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

5. Set environment variables in the Netlify dashboard:
   - REACT_APP_API_URL (your backend URL)
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_KEY

## Post-Deployment Steps

1. Update the frontend .env file with the production backend URL:
   ```env
   REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
   ```

2. Rebuild and redeploy the frontend with the updated backend URL.

3. Test the application in production:
   - User registration and login
   - Lesson access and progress tracking
   - Quiz functionality
   - Database operations

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the backend is configured to accept requests from the frontend domain.

2. **Database Connection Issues**: Verify the DATABASE_URL in the backend environment variables.

3. **Supabase Authentication Issues**: Verify the SUPABASE_URL and SUPABASE_KEY in both frontend and backend.

4. **Build Failures**: Check for any missing dependencies or syntax errors in the code.

### Debugging Tips

1. Check the logs in your hosting provider's dashboard.
2. Use the browser's developer tools to inspect network requests.
3. Test API endpoints directly using tools like Postman.

## Scaling Considerations

As your application grows, consider:

1. Implementing caching strategies
2. Using a CDN for static assets
3. Monitoring application performance
4. Setting up automated backups
5. Implementing CI/CD pipelines for automated deployments
