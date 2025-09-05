# Testing the Backend Server

## Starting the Server

1. Open a new command prompt window
2. Navigate to the backend directory:
   ```
   cd c:\Users\omara\Pictures\eng l\backend
   ```
3. Start the server:
   ```
   node src\index.js
   ```

   Alternatively, you can double-click the `start_server.bat` file to start the server.

4. You should see the following output:
   ```
   Server is running on port 5000
   Connected to Supabase successfully
   Database connection successful
   ```

## Testing the API Endpoints

Once the server is running, you can test the API endpoints using the following methods:

### Method 1: Using the Test Script

1. Open another command prompt window
2. Navigate to the backend directory:
   ```
   cd c:\Users\omara\Pictures\eng l\backend
   ```
3. Run the test script:
   ```
   node test_api.js
   ```

This will test the following endpoints:
- GET /api/users
- GET /api/lessons
- GET /api/settings

### Method 2: Using a Web Browser

You can also test the endpoints directly in your web browser by navigating to:
- http://localhost:5000/api/users
- http://localhost:5000/api/lessons
- http://localhost:5000/api/settings

### Method 3: Using Postman or curl

If you have Postman installed, you can create requests to the endpoints:
- GET http://localhost:5000/api/users
- GET http://localhost:5000/api/lessons
- GET http://localhost:5000/api/settings

Or using curl (if available):
```
curl http://localhost:5000/api/users
curl http://localhost:5000/api/lessons
curl http://localhost:5000/api/settings
```

## Expected Results

If everything is working correctly, you should receive JSON responses from each endpoint with the appropriate data. The status code should be 200 for successful requests.

## Troubleshooting

If you encounter any issues:

1. Make sure the server is running and you see the "Server is running on port 5000" message
2. Check that your environment variables in the .env file are correctly set
3. Ensure there are no other applications using port 5000
4. Check the server console for any error messages

## Summary

The migration from Prisma to Supabase has been completed successfully. The backend server is now using the Supabase client for all database operations, which should provide better performance and eliminate any connection issues you were experiencing with Prisma.
