# Profile Setup Guide

This guide explains how to set up and use the profile functionality in the AI Cold Mailer application.

## Database Setup

1. **Environment Variables**: Make sure you have a `DATABASE_URL` environment variable set in your `.env.local` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database
   ```

2. **Run Database Setup**: Execute the database setup script:
   ```bash
   npm run setup-db
   ```

3. **Verify Setup**: You can also run the Drizzle Studio to view your database:
   ```bash
   npm run dbs
   ```

## Profile Functionality

### Features
- **Basic Information**: Name, phone number, about section, and portfolio link
- **Education**: Add multiple education entries with university, grade, and field of study
- **Work Experience**: Add multiple work experiences with company, role, duration, and contributions
- **Skills**: Add multiple skills that will be displayed as badges
- **Projects**: Add multiple projects with name, tech used, and description

### How it Works
1. **First Time**: When you first visit the profile page, it will be empty
2. **Edit Mode**: Click "Edit Profile" to enter edit mode
3. **Save Data**: Fill in your information and click "Save" - this will store all data in the database
4. **Auto-Load**: Every time you open the app, your saved profile data will automatically load
5. **Update**: You can edit your profile anytime and the changes will be saved

### Database Schema
The profile data is stored across multiple tables:
- `user`: Basic user information
- `education`: Education entries
- `pastExperience`: Work experience entries
- `skill`: Skills list
- `project`: Project entries

All tables are linked to the user table via `userId` foreign key.

### API Endpoints
- `GET /api/profile`: Loads all profile data
- `POST /api/profile`: Saves profile data (creates or updates)

### Error Handling
- Loading errors are displayed as toast notifications
- Save errors are shown with specific error messages
- Empty fields are automatically filtered out when saving

## Usage Tips
1. **Skills**: Add skills one by one - they'll appear as badges in view mode
2. **Projects**: Include detailed descriptions and tech stacks for better impact
3. **Experience**: Focus on achievements and contributions rather than just job titles
4. **Education**: Include relevant coursework or projects if you're a recent graduate

## Troubleshooting
- If data doesn't load, check your database connection
- If save fails, ensure all required fields are filled
- Check browser console for detailed error messages 