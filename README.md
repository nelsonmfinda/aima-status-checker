# AIMA Status Checker

Automation tool to check AIMA immigration process status and send screenshot email notifications using Resend.

## What is AIMA?

**AIMA** (Agência para a Integração, Migrações e Asilo) is the **Portuguese Agency for Integration, Migrations and Asylum**. It's the government organization responsible for handling immigration processes in Portugal, including residence permits, visa applications, and asylum requests.

## What does this tool do?

This is an **automated status checker** that:

1. **Logs into the AIMA website** using your credentials
2. **Captures a screenshot** of your immigration process status page
3. **Emails you the screenshot** automatically via Resend
4. **Runs on a schedule** (every 4 days at 9 AM Lisbon time) on Vercel

## Why is this useful?

The AIMA portal allows applicants to check their immigration process status online. Instead of manually logging in every few days to check for updates, this tool:

- ✅ Automates the checking process
- ✅ Sends you visual updates via email
- ✅ Saves time and reduces manual monitoring
- ✅ Keeps a record of status changes through dated screenshots

This tool is particularly useful for immigrants waiting for residence permit decisions, visa approvals, or other immigration-related processes in Portugal.

## 🚨 Important: Geographic Restriction

The AIMA website is only accessible from Portuguese IP addresses. To work around this:

### Option 1: Portuguese Proxy (Recommended)

Configure a SOCKS5/HTTP Portuguese proxy in environment variables

### Option 2: Deploy on Portuguese Server

Use a Portuguese VPS (e.g., DigitalOcean Lisbon) or GitHub Actions with proxy

## 📋 Prerequisites

- Node.js 18+
- Vercel account (free tier available)
- Resend account (free up to 100 emails/month)
- AIMA login credentials
- Portuguese proxy (if not located in Portugal)

## 🚀 Quick Installation

```bash
# 1. Clone the repository
git clone <your-repository>
cd aima-status-checker

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit the .env file with your credentials

# 4. Test configuration
npm run test:connectivity
npm run test:email

# 5. Run locally
npm run dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# AIMA Credentials (required)
AIMA_EMAIL=your-email@example.com
AIMA_PASSWORD=your-password

# Resend Configuration (required)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RECIPIENT_EMAIL=recipient@example.com
SENDER_EMAIL=noreply@yourdomain.com  # Optional, defaults to: onboarding@resend.dev

# Vercel Security (optional)
CRON_SECRET=random-secure-string

# Portuguese Proxy (required if outside Portugal)
PROXY_SERVER=http://proxy-pt:port
PROXY_USERNAME=username  # Optional
PROXY_PASSWORD=password  # Optional

# Debug Mode (optional)
DEBUG=true  # Saves debug screenshots
```

### Resend Setup

1. **Create a free account**: <https://resend.com/signup>
2. **Get your API Key**: Dashboard > API Keys > Create API Key
3. **For testing**: Use `onboarding@resend.dev` as SENDER_EMAIL
4. **For production**: Verify your domain in Resend dashboard

## 🧪 Testing

```bash
# Test AIMA connectivity
npm run test:connectivity

# Test email configuration
npm run test:email

# Quick test (alias for connectivity)
npm test
```

## 💻 Development Commands

```bash
# Development
npm run dev              # Run locally with tsx
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled version

# Code Quality
npm run lint             # Type-check without building
npm run clean            # Clean dist/ directory

# Deployment
npm run vercel-build     # Build for Vercel (includes Playwright)
```

## 📦 Vercel Deployment

### Via Dashboard

1. Connect your GitHub repository to Vercel
2. Configure environment variables in dashboard:
   - `AIMA_EMAIL`
   - `AIMA_PASSWORD`
   - `RESEND_API_KEY`
   - `RECIPIENT_EMAIL`
   - `SENDER_EMAIL` (optional)
   - `CRON_SECRET` (optional)
   - `PROXY_SERVER` (if needed)
   - `PROXY_USERNAME` (if applicable)
   - `PROXY_PASSWORD` (if applicable)
3. Automatic deployment

### Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables
vercel env add AIMA_EMAIL
vercel env add AIMA_PASSWORD
# ... (add all variables)
```

### Cron Job

The cron job runs automatically every 4 days at 9 AM (Lisbon time):

- Endpoint: `/api/check-status`
- Schedule: `0 9 */4 * *`
- Configured in: `vercel.json`

## 🏗️ Architecture

### Directory Structure

```
src/
├── config/
│   ├── constants.ts          # URLs, selectors, timeouts
│   └── environment.ts        # Environment variable validation
├── services/
│   ├── browser.service.ts    # Playwright browser management
│   ├── auth.service.ts       # AIMA authentication
│   ├── screenshot.service.ts # Screenshot capture
│   ├── email.service.ts      # Email sending via Resend
│   └── scraper.service.ts    # Workflow orchestration
├── utils/
│   ├── logger.util.ts        # Structured logging
│   ├── retry.util.ts         # Retry with exponential backoff
│   └── date.util.ts          # Date formatting
└── types/
    ├── config.types.ts       # Configuration interfaces
    ├── scraper.types.ts      # Scraper types
    └── errors.ts             # Custom error classes
```

### Services

**BrowserService**: Manages Playwright browser lifecycle

- Browser launch with proxy configuration
- Context creation with Portuguese locale
- Resource cleanup

**AuthService**: Handles AIMA website authentication

- Navigation with automatic retry
- Login form filling
- Debug and error screenshots

**ScreenshotService**: Captures page screenshots

- Full-page PNG screenshots
- Page scroll to top
- Error handling

**EmailService**: Sends emails via Resend

- Payload construction with attachments
- HTML email formatting
- API error handling

**ScraperService**: Orchestrates the entire workflow

- Coordinates all services
- Error handling management
- Resource cleanup

## 🛡️ Geographic Restriction Solution

### Option 1: HTTP/SOCKS5 Proxy

Configure in `.env`:

```env
PROXY_SERVER=http://proxy-portugal.com:8080
PROXY_USERNAME=username
PROXY_PASSWORD=password
```

### Option 2: Portuguese VPS

Deploy directly on:

- **DigitalOcean Lisbon**: Starting at $6/month
- **Vultr Lisbon**: Starting at $5/month
- **Contabo Portugal**: Starting at €4.99/month

## 🔧 Troubleshooting

### Error: "Site not accessible"

✅ Configure a Portuguese proxy
✅ Verify proxy is working with `npm run test:connectivity`

### Error: "Missing required environment variable"

✅ Check your `.env` file
✅ Confirm all required variables are defined

### Error: "Login failed"

✅ Verify your AIMA credentials
✅ The site may have changed - check `src/config/constants.ts` → `SELECTORS`
✅ Enable debug mode: `DEBUG=true`

### Email not sent

✅ Verify Resend API Key
✅ Use `onboarding@resend.dev` for testing
✅ Check logs in Resend dashboard: <https://resend.com/emails>

### Vercel timeout

✅ 60-second limit is tight
✅ Check function logs in Vercel dashboard
✅ Consider increasing timeouts in `src/config/constants.ts`

## 📊 Monitoring

### Local Logs

```bash
npm run dev
# Structured logs with timestamps and levels
```

### Vercel Logs

1. Access Vercel dashboard
2. Go to Functions → Logs
3. Filter by `/api/check-status`

### Resend Dashboard

- View status of each sent email
- Configure webhooks for notifications
- Analyze deliverability

## 🔐 Security

- ✅ Never commit the `.env` file
- ✅ Use secrets in Vercel/GitHub
- ✅ Rotate `CRON_SECRET` regularly
- ✅ Resend API Key has limited scope
- ✅ Vercel endpoint protected by Bearer token

## 📝 Common Modifications

### Change CSS Selectors

If the AIMA website changes, edit `src/config/constants.ts`:

```typescript
export const SELECTORS = {
  LOGIN_FORM: '#login_form',          // Update here
  EMAIL_INPUT: 'input[name="email"]', // Update here
  // ...
}
```

### Adjust Timeouts

Edit `src/config/constants.ts`:

```typescript
export const TIMEOUTS = {
  NAVIGATION: 45000,  // Increase if needed
  // ...
}
```

### Add New Service

1. Create `src/services/new-service.ts`
2. Define interface in `src/types/`
3. Inject into `ScraperService` constructor
4. Use in `execute()` method

## 📚 Additional Documentation

- **QUICK-START.md**: Quick start guide
- **PROXY-GUIDE.md**: Detailed proxy configuration
- **CLAUDE.md**: Technical documentation for AI
- **REFACTORING-SUMMARY.md**: v2.0 refactoring details

## 🤝 Support

### AIMA Issues

Contact AIMA directly

### Script Issues

1. Check logs (debug mode enabled)
2. Run tests: `npm run test:connectivity` and `npm run test:email`
3. See CLAUDE.md for architecture
4. Open an issue on GitHub

### Resend Issues

- Documentation: <https://resend.com/docs>
- Support: <support@resend.com>
- Dashboard: <https://resend.com>

## 📄 License

MIT
