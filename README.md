# Wedding Website

A production-ready wedding website built with Next.js 14, featuring RSVP collection, photo galleries, event schedules, and registry management.

## Features

- 🎉 **Landing Page** - Beautiful hero section with countdown timer, photo carousel, and location map
- 📅 **Event Schedule** - Timeline of events with ICS calendar file downloads
- ✅ **RSVP System** - Collect RSVPs with email confirmations and calendar attachments
- 📸 **Photo Galleries** - Curated galleries with guest photo uploads and moderation
- 🎁 **Registry** - External registry links and optional Stripe cash gift integration
- 🔐 **Admin Dashboard** - Full management interface for all content
- 📧 **Email Notifications** - Automated emails via Resend
- 🎨 **Modern UI** - Elegant design with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js
- **Email**: Resend
- **File Storage**: UploadThing or Supabase Storage
- **Payments**: Stripe (optional)

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- PostgreSQL database (Neon, PlanetScale, or local)
- Resend account for emails
- (Optional) UploadThing or Supabase account for file uploads
- (Optional) Stripe account for cash gifts

## Setup

### 1. Clone and Install

```bash
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your app URL (e.g., `http://localhost:3000`)
- `RESEND_API_KEY` - From your Resend dashboard
- `RESEND_FROM_EMAIL` - Your verified sender email

Optional variables:
- `UPLOADTHING_SECRET` & `UPLOADTHING_APP_ID` - For file uploads
- `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For cash gifts
- `NEXT_PUBLIC_MAPS_EMBED_API_KEY` - For Google Maps embeds
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For Google OAuth

### 3. Database Setup

```bash
# Push schema to database
pnpm db:push

# Or run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Setup (Neon)

1. Create a Neon project
2. Copy the connection string to `DATABASE_URL`
3. Run `pnpm db:push` in Vercel build or locally before first deploy

### Environment Variables for Production

Set these in your Vercel project settings:

- All variables from `.env.example`
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://yourdomain.com`)

### Post-Deployment

1. Run database migrations: `pnpm db:push` or `pnpm prisma migrate deploy`
2. Seed initial data: `pnpm db:seed` (optional)
3. Create your admin user via Prisma Studio or direct database access
4. Configure your admin email in the database (set `role = 'ADMIN'`)

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── gallery/           # Gallery pages
│   ├── rsvp/              # RSVP pages
│   └── ...
├── components/            # React components
│   ├── admin/            # Admin components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
├── prisma/                # Prisma schema and migrations
└── public/                # Static assets
```

## Key Features Implementation

### RSVP Flow

1. Guest submits RSVP form
2. System creates/updates RSVP record
3. Confirmation email sent with ICS calendar file
4. Guest receives confirmation page with edit link

### Photo Upload

1. Guest uploads photos via `/gallery/submit`
2. Photos stored with `PENDING` status
3. Admin reviews in `/admin` dashboard
4. Approved photos appear in public gallery
5. Guest receives approval notification email

### Admin Dashboard

Access at `/admin` (requires ADMIN role):

- **RSVPs**: View, search, export to CSV
- **Events**: Create, edit, delete events
- **Photos**: Moderate guest uploads
- **Registry**: Manage registry items
- **Settings**: Configure site settings

## Testing

```bash
# Run E2E tests
pnpm test

# Run with UI
pnpm test:ui
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm db:push` - Push Prisma schema to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio

## Customization

### Couple Names & Date

Set in environment variables:
- `COUPLE_NAME_1`
- `COUPLE_NAME_2`
- `WEDDING_DATE`

Or update in the database via admin dashboard.

### Colors

Edit `tailwind.config.ts` to customize the color palette:
- `blush`: #F6E7E7
- `forest`: #1D3B2A
- `champagne`: #F9F4EC
- `ink`: #121212

### Fonts

The site uses:
- System fonts for body text
- "Playfair Display" for headings (loaded via Google Fonts)

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check SSL requirements (Neon requires `?sslmode=require`)
- Ensure database is accessible from your network

### Email Not Sending

- Verify Resend API key is correct
- Check `RESEND_FROM_EMAIL` is a verified domain/email
- Check Resend dashboard for delivery logs

### File Upload Issues

- Ensure UploadThing or Supabase credentials are set
- Check file size limits (default: 10MB)
- Verify CORS settings if using Supabase

## License

Private - For personal use only.

## Support

For issues or questions, please check the documentation or create an issue in the repository.

