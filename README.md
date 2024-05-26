# Supalinks - A Supabase + Nuxt 3 URL shortener example

## Database

To make edits to the database, you need to install Docker and run the following command in the `server` directory:

```bash
npx supabase start
```

This will start a local Supabase Studio at `http://127.0.0.1:54323`.

After making changes to the database, you can create a new migration by running:

```bash
npx supabase db diff -f your_update
```

For more information, check out the [Supabase documentation](https://supabase.com/docs/guides/cli/managing-environments).

## Setup

Make sure to install the dependencies:

```bash
pnpm i
```

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```
