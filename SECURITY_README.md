Security recommendations and changes applied:

- Separated client-side and server-side API keys:
  - `GEMINI_API_KEY` is now a server-side environment variable used by `/api/gemini`.
  - Do not use `NEXT_PUBLIC_GEMINI_API_KEY` or other `NEXT_PUBLIC_*` for private keys.

- Removed hard-coded private key placeholders from UI strings and replaced them with safer placeholders.
  - Replaced the `-----BEGIN PRIVATE KEY-----\n` placeholder with a clear message encouraging use of service account JSON or env variables.

- Replaced client direct calls to Google Gemini in the frontend with server-side proxy endpoint `/api/gemini`.
  - This prevents exposing API keys in frontend bundles.

- Replaced the vulnerable `xlsx` package with `exceljs` and updated the code to use it.
  - `xlsx` had high-severity vulnerabilities, no fix available.
  - If you rely heavily on Excel features, check `exceljs` compatibility (we replaced `XLSX.writeFile` usage with ExcelJS buffer and save flow).

- Upgraded Next.js to 16.0.10 and applied fixes for API and TypeScript changes (e.g., NextRequest IP header parsing and removing deprecated `swcMinify` config warnings).

- `.env.local` should never be committed. Use `.env.local` in dev only and `.env.example` for examples. Add the required values to your hosting service or CI secrets.

- Files reviewed and updated:
  - `src/components/export/ExportDestination.tsx`
  - `src/components/export/ExportSourceConfig.tsx`
  - `src/pages/planilha/index.tsx` (replaced XLSX with ExcelJS)
  - `src/pages/api/gemini.ts` (accepts custom payload and uses server-side `GEMINI_API_KEY`)
  - Many components that called Gemini directly now use `/api/gemini` endpoint.

What I didn’t change automatically:
- I left your `.env.local` untouched (not tracked by git). If you want, I can create `.env.local.example` and scrub secrets.

Follow-up actions (recommended):
1. Replace any remaining `NEXT_PUBLIC_*` sensitive values with server-only env variables (no `NEXT_PUBLIC_`).
2. Move all service credentials into environment variables in your hosting (Vercel/Netlify/Heroku) secrets.
3. Rotate any secrets that were exposed in source control (e.g., API keys already leaked).
4. Review CI/CD and deployment configs for private keys.

If you want me to also:
- Migrate all remaining XLSX usage to `exceljs` (done for the main page `planilha`), or migrate other `xlsx` use.
- Replace any other hardcoded API keys in other files.
- Rotate and remove `.env.local` file contents and replace them with `.env.local.example` placeholders and instructions.

Let me know which of the follow-up actions you want me to run automatically.