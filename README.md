
  # FloroDay Web Application

  This is a code bundle for FloroDay Web Application. The original project is available at https://www.figma.com/design/uDKfemHltf2A8AJ7tEkV5h/FloroDay-Web-Application.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
 
 ## Deploying to Vercel
 
 1. Create a new Vercel project and import this repository.
 2. Set the Build Command to `npm run build` and Output Directory to `build` (already configured in `vite.config.ts`).
 3. Add the environment variables from `ENV.EXAMPLE.txt` to your Vercel Project Settings → Environment Variables.
 4. Ensure `vercel.json` is committed. It configures SPA routing and long-term caching for assets.
 5. Trigger a deploy. The site will be served as a static SPA with client-side routing.

 ### Environment variables
 - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` – Supabase client config.
 - `VITE_STRIPE_PUBLISHABLE_KEY` – Stripe publishable key (payments UI). Secret keys should be configured only in your backend or serverless functions (not present in this SPA bundle).
 - `VITE_PUBLIC_BASE_URL` – e.g. `https://your-project.vercel.app` for links/OG.
 - Optional flags: `VITE_FEATURE_ENABLE_MUSIC`, `VITE_FEATURE_AI_ENABLED`.

 ### Notes
 - This bundle is Vite + React SPA. API routes mentioned in the spec are expected to live in a separate Next.js backend or serverless functions; point your frontend to those endpoints via env vars.
 - For Supabase Auth (Magic Link), configure the Site URL in Supabase to your Vercel domain and add redirect URLs accordingly.
  