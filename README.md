# Public git repo for my personal site

## How to run it

_This readme will use pnpm because I like pnpm. That doesn't mean you need to._

1. clone the repo
2. run `pnpm i` in the project root, or your preferred alternative
3. create a .env file containing your desired variables. I have documented these in a separate section below.
4. either run `pnpm dev` or `pnpm build` and you're good to go

# Environment Variables

| Variable Name                        | Description                                                         | Default Value                     |
| ------------------------------------ | ------------------------------------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_BASE_URL`               | The base url to serve uploads at. REQUIRED!!                        | `http://localhost:3000`           |
| `NEXT_PUBLIC_API_URL`                | The API url for the backend stuff. REQUIRED!!                       | `http://localhost:3000`           |
| `NEXT_PUBLIC_BRANDING`               | The branding for the site.                                          | `keiran.cc`                       |
| `DATABASE_URL`                       | The postgres DB to store shortened URLs and pastes. REQUIRED!!      | *(No default)*                    |