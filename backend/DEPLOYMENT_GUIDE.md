# Deployment Guide

This guide provides instructions for deploying your English Learning Platform backend to various server environments.

## Prerequisites

Before deploying, ensure you have:
1. Completed the migration from Prisma to Supabase
2. Set up your Supabase project and configured the environment variables
3. Tested your application locally to ensure it works correctly

## Environment Variables

Your application requires the following environment variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

## Deployment Options

### Option 1: Heroku

Heroku is a popular platform-as-a-service that makes deployment easy.

#### Steps:

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install the Heroku CLI
3. Login to Heroku:
   ```
   heroku login
   ```
4. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
5. Add the buildpack for Node.js:
   ```
   heroku buildpacks:set heroku/nodejs
   ```
6. Set the environment variables:
   ```
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_KEY=your_supabase_key
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
7. Deploy your code:
   ```
   git init
   heroku git:remote -a your-app-name
   git add .
   git commit -m "Initial commit"
   git push heroku master
   ```
8. Open your application:
   ```
   heroku open
   ```

### Option 2: Docker

You can deploy your application using Docker containers.

#### Steps:

1. Install Docker on your server
2. Build the Docker image:
   ```
   docker build -t english-learning-backend .
   ```
3. Run the container:
   ```
   docker run -p 5000:5000 \
     -e SUPABASE_URL=your_supabase_url \
     -e SUPABASE_KEY=your_supabase_key \
     -e SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key \
     english-learning-backend
   ```

#### Docker Compose (for production with Nginx):

Create a `docker-compose.yml` file:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - SUPABASE_URL=your_supabase_url
      - SUPABASE_KEY=your_supabase_key
      - SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_KEY
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    restart: unless-stopped
```

Then run:
```
docker-compose up -d
```

### Option 3: AWS Elastic Beanstalk

AWS Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications.

#### Steps:

1. Create an AWS account
2. Install the AWS CLI and Elastic Beanstalk CLI
3. Initialize your Elastic Beanstalk application:
   ```
   eb init
   ```
4. Create your environment:
   ```
   eb create production
   ```
5. Set environment variables:
   ```
   eb setenv SUPABASE_URL=your_supabase_url
   eb setenv SUPABASE_KEY=your_supabase_key
   eb setenv SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
6. Deploy your application:
   ```
   eb deploy
   ```

### Option 4: DigitalOcean App Platform

DigitalOcean offers a simple PaaS solution.

#### Steps:

1. Create a DigitalOcean account
2. Install the doctl CLI
3. Authenticate with DigitalOcean:
   ```
   doctl auth init
   ```
4. Create an app spec file (`.do/app.yaml`):
   ```yaml
   name: english-learning-backend
   services:
   - name: api
     source_dir: /
     github:
       repo: your-username/your-repo
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: SUPABASE_URL
       value: your_supabase_url
     - key: SUPABASE_KEY
       value: your_supabase_key
     - key: SUPABASE_SERVICE_ROLE_KEY
       value: your_supabase_service_role_key
   ```
5. Create and deploy the app:
   ```
   doctl apps create --spec .do/app.yaml
   ```

### Option 5: VPS (Virtual Private Server)

For more control, you can deploy to a VPS like DigitalOcean Droplets, AWS EC2, or Linode.

#### Steps:

1. Set up a VPS with Ubuntu 20.04 or similar
2. Install Node.js and npm:
   ```
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Install PM2 (process manager for Node.js):
   ```
   sudo npm install -g pm2
   ```
4. Clone your repository:
   ```
   git clone your-repo-url
   cd your-repo-directory
   ```
5. Install dependencies:
   ```
   npm install
   ```
6. Set up environment variables:
   ```
   nano .env
   ```
   Add your environment variables to this file
7. Start the application with PM2:
   ```
   pm2 start src/index.js --name "english-learning-backend"
   pm2 startup
   pm2 save
   ```
8. Set up Nginx as a reverse proxy (optional but recommended):
   ```
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/english-learning
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```
   sudo ln -s /etc/nginx/sites-available/english-learning /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Post-Deployment Testing

After deployment, test your application:

1. Check that the server is running
2. Test the API endpoints:
   - GET /api/users
   - GET /api/lessons
   - GET /api/settings
   - POST /api/users (for creating new users)
   - etc.

3. Verify that the database connections are working properly

## Monitoring and Logging

For production deployments, consider setting up:

1. Application monitoring (e.g., PM2 monitoring, New Relic, Datadog)
2. Error tracking (e.g., Sentry, Bugsnag)
3. Log aggregation (e.g., ELK stack, Papertrail)

## Security Considerations

1. Ensure your environment variables are properly secured
2. Implement rate limiting for your API endpoints
3. Use HTTPS in production
4. Validate all user inputs
5. Implement proper authentication and authorization

## Scaling

As your application grows, consider:

1. Horizontal scaling (adding more instances)
2. Load balancing
3. Database optimization
4. Caching strategies

## Backup and Recovery

1. Regularly backup your Supabase database
2. Implement a disaster recovery plan
3. Test your backup and recovery procedures

This guide covers the most common deployment options. Choose the one that best fits your needs, budget, and technical expertise.
