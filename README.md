# 🚄 Multimodal UI - Railway Route Planner

A Next.js frontend for planning railway routes across Europe, connecting Trainline (UK) and Benerail (Europe) services.

## Features

- **Station Search**: Autocomplete search across 731K+ railway stations
- **Multi-hop Routing**: Find routes with automatic provider transfers
- **Cross-provider Support**: Trainline (UK) ↔ Benerail (Europe)
- **Clean UI**: Handrolled components with white/gray theme

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Make sure your backend is running on `localhost:8080`

## API Integration

The frontend connects to a backend service running on `localhost:8080` with endpoints:

- `GET /places/search?q=<query>` - Station search
- `POST /routes/find` - Route finding
- `GET /health` - Health check

## Current Coverage

- **Working**: Germany → United Kingdom routing
- **Supported**: DE, FR, BE, NL, GB stations
- **Transfer Hubs**: London St. Pancras, Ebbsfleet, Ashford International

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Axios for API calls
- Handrolled UI components (no external UI library)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
