# Quick Setup Guide

## Initial Setup Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Set Up Database**
   ```bash
   # Push schema to database
   pnpm db:push
   
   # Seed with sample data
   pnpm db:seed
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

## Required Environment Variables

### Essential (Must Have)
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
- `RESEND_API_KEY` - From Resend dashboard
- `RESEND_FROM_EMAIL` - Verified sender email

### Optional but Recommended
- `UPLOADTHING_SECRET` & `UPLOADTHING_APP_ID` - For photo uploads
- `NEXT_PUBLIC_MAPS_EMBED_API_KEY` - For Google Maps
- `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For cash gifts

### Customization
- `COUPLE_NAME_1` - First name (default: "Alex")
- `COUPLE_NAME_2` - Second name (default: "Jordan")
- `WEDDING_DATE` - ISO date string (default: "2024-06-15T16:00:00Z")
- `NEXT_PUBLIC_APP_URL` - Your production URL

## Creating Admin User

After seeding, the admin user is created with:
- Email: `admin@example.com`
- Role: `ADMIN`

**Important**: Change this email in your database to your actual admin email, or create a new admin user:

```sql
-- Via Prisma Studio: pnpm db:studio
-- Or directly in database:
UPDATE "User" SET email = 'your-email@example.com' WHERE email = 'admin@example.com';
```

## First Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy
5. After first deploy, run migrations:
   ```bash
   pnpm prisma migrate deploy
   ```
   Or use Vercel's build command to auto-run migrations

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Admin user created/updated
- [ ] Resend email domain verified
- [ ] Test RSVP flow end-to-end
- [ ] Test photo upload (if UploadThing configured)
- [ ] Test Stripe checkout (if enabled)
- [ ] Update sitemap URL in `app/sitemap.ts`
- [ ] Update robots.txt with your domain

## Testing

```bash
# Run E2E tests
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint
```

## Common Issues

### Database Connection
- Verify `DATABASE_URL` format (Neon requires `?sslmode=require`)
- Check database is accessible

### Email Not Sending
- Verify Resend API key
- Check `RESEND_FROM_EMAIL` is verified
- Check Resend dashboard for logs

### File Uploads Not Working
- Ensure UploadThing credentials are set
- Check file size limits
- Verify CORS if using Supabase

