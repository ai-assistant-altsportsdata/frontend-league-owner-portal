# Vercel Deployment Guide

## Quick Deployment (Recommended)

### Method 1: One-Click GitHub Integration

1. **Visit**: [vercel.com/new](https://vercel.com/new)
2. **Import**: Select "Import Git Repository"
3. **Repository URL**: `https://github.com/ai-assistant-altsportsdata/frontend-league-owner-portal`
4. **Framework**: Next.js (auto-detected)
5. **Settings**: Use defaults (all configured in vercel.json)
6. **Deploy**: Click "Deploy"

**Expected URL**: `https://frontend-league-owner-portal-[hash].vercel.app`

### Method 2: API Deployment

```bash
# Get your Vercel token from: https://vercel.com/account/tokens
./deploy-to-vercel.sh YOUR_VERCEL_TOKEN
```

### Method 3: Vercel CLI (if authentication works)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Configuration Details

The project is pre-configured with:

- ✅ **vercel.json**: Framework detection, build commands
- ✅ **next.config.mjs**: Vercel-optimized settings
- ✅ **TypeScript/ESLint**: Errors disabled for builds
- ✅ **Images**: Remote patterns configured
- ✅ **CORS**: API headers configured

## Expected Deployment URL

After deployment, your application will be available at:
- **Primary**: `https://frontend-league-owner-portal.vercel.app`
- **Branch deploys**: `https://frontend-league-owner-portal-git-[branch].vercel.app`

## Troubleshooting

### Build Issues
- TypeScript errors are ignored (`ignoreBuildErrors: true`)
- ESLint errors are ignored (`ignoreDuringBuilds: true`)

### Environment Variables
- `NEXT_TELEMETRY_DISABLED=1` (pre-configured)
- Add custom env vars in Vercel dashboard if needed

### Performance
- Configured for `iad1` region (US East)
- Standalone output disabled for Vercel
- Sharp optimization enabled

## Post-Deployment

1. **Verify**: Check the deployment URL works
2. **Custom Domain**: Add custom domain in Vercel settings
3. **Analytics**: Enable Vercel Analytics if needed
4. **Monitoring**: Set up error tracking

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)