# Migration from Prisma to Supabase Client

## Changes Made

### 1. Created a new Supabase configuration file
- Created `backend/src/supabase.js` to replace `backend/src/db.js`
- This file initializes the Supabase client with the service role key for admin operations

### 2. Updated package.json
- Removed Prisma dependencies (`@prisma/client` and `prisma`)
- Removed Prisma-related scripts
- Kept only essential scripts and the Supabase client library

### 3. Updated index.js
- Changed the database connection import from `./db` to `./supabase`
- Updated variable name from `prisma` to `supabase`

### 4. Updated route files
All route files have been updated to use the Supabase client instead of Prisma:

#### users.js
- Completely rewritten to use Supabase client
- Updated all CRUD operations to use Supabase syntax
- Changed field names to match Supabase conventions (snake_case)
- New file created as `users_new.js`

#### progress.js
- Completely rewritten to use Supabase client
- Updated all CRUD operations to use Supabase syntax
- Changed field names to match Supabase conventions (snake_case)
- New file created as `progress_new.js`

#### quiz.js
- Completely rewritten to use Supabase client
- Updated all CRUD operations to use Supabase syntax
- Changed field names to match Supabase conventions (snake_case)
- New file created as `quiz_new.js`

#### admin.js
- Already using Supabase client, but updated to use service role key
- No other changes needed

#### settings.js
- Completely rewritten to use Supabase client
- Updated all CRUD operations to use Supabase syntax
- New file created as `settings_new.js`

#### lessons.js
- Already using Supabase client, but updated to use service role key
- No other changes needed

## Next Steps

### 1. Replace the original route files with the new ones
You need to replace the following files:
- `backend/src/routes/users.js` with `backend/src/routes/users_new.js`
- `backend/src/routes/progress.js` with `backend/src/routes/progress_new.js`
- `backend/src/routes/quiz.js` with `backend/src/routes/quiz_new.js`
- `backend/src/routes/settings.js` with `backend/src/routes/settings_new.js`

### 2. Update environment variables
Make sure your `.env` file contains the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Test the application
Start the backend server and test all the routes to ensure they work correctly with Supabase.

### 4. Remove Prisma-related files (optional)
Once you've confirmed everything works with Supabase, you can remove:
- The `backend/prisma` directory
- The `backend/src/db.js` file

## Benefits of This Migration

1. **Direct connection to Supabase**: No more connection issues between Prisma and Supabase
2. **Simplified architecture**: Fewer dependencies and a more direct approach to database operations
3. **Better use of Supabase features**: Direct access to all Supabase features and capabilities
4. **Easier maintenance**: One less dependency to manage and update

## Notes

- All field names have been converted from camelCase (Prisma convention) to snake_case (Supabase convention)
- The service role key is used for admin operations to bypass Row Level Security (RLS) when needed
- The regular Supabase key is still used for client-side operations where RLS should be enforced
