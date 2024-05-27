# Supalinks - A Supabase + Nuxt 3 URL shortener

It includes:

- Nuxt UI
- Eslint and Prettier
- Supabase CI/CD integration
- Sign up and sign in with magic link using Supabase Auth
- Create, read, update, and delete links
- Click tracking

Guide and inspiration from:

- https://ui.nuxt.com/
- https://supabase.nuxtjs.org/
- https://supabase.com/docs/guides/cli/managing-environments
- https://github.com/nuxt-modules/supabase/tree/main/demo
- https://github.com/jahidanowar/shrty
- https://github.com/Barbapapazes/url-shortener

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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
