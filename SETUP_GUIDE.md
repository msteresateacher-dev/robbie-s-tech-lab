# Quick Setup Guide - Supabase Migration

This guide will help you get your migrated application up and running quickly.

## Prerequisites
- Node.js installed
- A Supabase account ([sign up here](https://supabase.com))
- An OpenAI API key ([get one here](https://platform.openai.com))

## Step-by-Step Setup

### 1. Install Supabase Package
```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `robbie-tech-lab` (or your preferred name)
   - Database Password: (create a strong password)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 3. Get Supabase Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 4. Create Environment File
1. In your project root, create a file named `.env.local`
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=sk-...
```

**Important**: Replace the placeholder values with your actual credentials!

### 5. Run Database Migrations

#### Option A: Using Supabase Dashboard (Easiest)
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/20260217_initial_schema.sql`
5. Paste into the SQL editor
6. Click **Run** button
7. You should see "Success. No rows returned"

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 6. Verify Database Setup
1. In Supabase dashboard, go to **Table Editor**
2. You should see three tables:
   - `students`
   - `mission_sessions`
   - `user_logs`

### 7. Get OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (starts with `sk-...`)
6. Add it to your `.env.local` file

### 8. Start Development Server
```bash
npm run dev
```

### 9. Test the Application
1. Open your browser to the local development URL (usually `http://localhost:5173`)
2. Try to sign up for a new account
3. Create a student profile
4. Start a mission
5. Check that everything works!

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution**: Run `npm install @supabase/supabase-js`

### Issue: "Invalid API key" or "Unauthorized"
**Solution**: 
- Check that your `.env.local` file exists in the project root
- Verify the credentials are correct
- Make sure variable names start with `VITE_`
- Restart your dev server after changing `.env.local`

### Issue: "Table does not exist"
**Solution**: 
- Make sure you ran the migration SQL script
- Check the Supabase dashboard to verify tables were created

### Issue: "Row Level Security policy violation"
**Solution**: 
- This is expected if you're not authenticated
- Make sure you're logged in
- Check that RLS policies were created (they're in the migration script)

### Issue: OpenAI API errors
**Solution**:
- Verify your API key is correct
- Check that you have credits in your OpenAI account
- The weather feature in Extra Games uses OpenAI

## Next Steps

Once everything is working:

1. **Remove Base44 dependencies** (optional):
   ```bash
   npm uninstall @base44/sdk
   ```

2. **Delete old Base44 files** (optional):
   - `src/api/base44Client.js`
   - `src/lib/app-params.js` (if not used elsewhere)

3. **Deploy to production**:
   - Make sure to set environment variables in your hosting platform
   - Never commit `.env.local` to git (it's already in `.gitignore`)

## Support

If you encounter issues:
1. Check the `MIGRATION_SUMMARY.md` for detailed information
2. Review Supabase documentation: https://supabase.com/docs
3. Check OpenAI documentation: https://platform.openai.com/docs

## Security Notes

- ⚠️ **Never commit `.env.local`** to version control
- ⚠️ **Never share your API keys** publicly
- ✅ The `.env.local.example` file is safe to commit (it has no real credentials)
- ✅ Row Level Security is enabled to protect user data

---

**You're all set!** 🎉

Your application is now running on Supabase with OpenAI integration!
