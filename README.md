## About This Project
"Beyond the Numbers: The Palestine Data & Memorial Project" was created to provide a clear, focused, and data-driven hub to document and memorialize the human cost of the ongoing crisis in Palestine.

## Inspiration & Data
This project is deeply inspired by the crucial work of platforms like Genocide Monitor.

The statistical backbone of this dashboard is provided by the Palestine Datasets initiative from Tech For Palestine. Their tireless, open-source effort to compile and verify information from sources like the Gaza Ministry of Health, the Gaza Government Media Office, and UN OCHA is what makes the data visualizations on this site possible.

## Design & Technology Credits
A project like this is a collective effort, and we are grateful for the open-source community. The visual presentation of this site was made possible by the following creative works:

- The animated "Starry Night" background that sets the solemn tone for this site was created by **Sean Dempsey**.
  - Copyright (c) 2025 by Sean Dempsey ([CodePen Link](https://codepen.io/seanseansean/pen/JdMMdG))

- The glowing "Edge Card" effect used throughout the dashboard is based on the work of **SpectacledCoder**.
  - Copyright (c) 2025 by SpectacledCoder ([CodePen Link](https://codepen.io/SpectacledCoder/pen/xxBVKeL))

This hub stands on the shoulders of these incredible open-source efforts, and we are immensely grateful for the community's contributions to transparency and remembrance.

---

## Project Structure & Architecture

This section provides a comprehensive overview of the project's file structure and how different parts of the application are interconnected.

### High-Level Overview

The application is built using the **Next.js App Router**, with **React Server Components (RSC)** as the default. Data is primarily fetched on the server from a **Supabase** backend, and then passed as props to client-side components for interactive rendering. Styling is handled by **Tailwind CSS** and **ShadCN UI**.

### Core Directories

#### 1. `src/app/` - Routing and Pages
This is the heart of the Next.js application. Each folder represents a URL route.

- **`layout.tsx`**: The main root layout for the entire application. It wraps all pages and includes:
    - Global CSS (`globals.css`).
    - The main header (`<Header />`).
    - Theme provider (`<CustomThemeProvider />`) for light/dark mode.
    - `Toaster` for notifications and `Analytics`.
    - `BodyClassNameUpdater` which dynamically changes the body's background class based on the current page.

- **`page.tsx` (Homepage / Dashboard)**:
    - This is a **Server Component**. It fetches all necessary data for the dashboard (overview stats, timeline data, etc.) using server-side functions from `src/app/actions.ts`.
    - It then renders the `<DashboardClient />` component, passing the fetched data as props. This pattern keeps data fetching on the server for performance while allowing interactivity on the client.

- **`/chronology/`**, **`/martyrs/`**, **`/feed/`**: These folders follow a similar pattern.
    - **`page.tsx`**: A Server Component that performs the initial data fetch (e.g., `fetchMartyrs` for the martyrs page).
    - **`[page-name]-wrapper.tsx`**: A simple client component that dynamically imports the main client page component, often showing a skeleton loader while the main component loads. This improves the initial page load performance.
    - **`[page-name]-client.tsx`**: The main client component for the page, which handles all user interactions like searching, sorting, loading more data, and state management (`useState`, `useEffect`).

- **`/admin/`**: Contains the secure area for content moderation.
    - **`page.tsx` & `dashboard-client.tsx`**: The main admin dashboard for reviewing entries.
    - **`login/page.tsx`**: The admin login form.
    - **`actions.ts`**: Server Actions specific to admin functions (login, logout, approve, delete).

- **`actions.ts`**: Contains server-side functions (Server Actions) that can be called directly from client or server components to interact with the database (e.g., `getOverviewStats`). This avoids the need to create separate API endpoints.

#### 2. `src/components/` - Reusable UI Components
This directory contains all the React components used across the application.

- **`/ui/`**: Core, unstyled UI primitives from **ShadCN UI** (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`). These are the building blocks.
- **`/layout/`**: Components related to the overall page structure, like `Header.tsx`, `ThemeToggle.tsx`, and `StarsBackground.tsx`.
- **Top-level components (`Overview.tsx`, `CumulativeTimeline.tsx`, etc.)**: These are the main "widget" components used on the dashboard. They are designed as client components to handle animations and user interactions. They receive data as props from their parent server components.
- **`dashboard-client.tsx`**: A key component that assembles the main dashboard. It receives all data fetched by the server (`/app/page.tsx`) and passes it down to the individual chart and stat components. It also handles client-side logic like the "Download Image" functionality.

#### 3. `src/lib/` - Libraries, Types, and Static Data
A collection of shared logic and data.

- **`utils.ts`**: Contains utility functions, most notably the `cn` function for merging Tailwind CSS classes.
- **`types.ts`**: Defines TypeScript interfaces for data structures used throughout the app (e.g., `Martyr`, `GuestbookEntry`). This ensures type safety.
- **`hadiths.ts` & `timeline-data.ts`**: Contain static data arrays used on the site.

#### 4. `src/utils/supabase/` - Supabase Client Configuration
This folder contains files for initializing the Supabase client in different environments.
- **`client.ts`**: Used for creating a Supabase client in **Client Components** (runs in the browser).
- **`server.ts`**: Used for creating a Supabase client in **Server Components** and **Server Actions**.
- **`middleware.ts`**: Creates a client for use within Next.js middleware.

#### 5. `supabase/` - Backend Logic (Edge Functions)
This directory is for Supabase-specific backend code.

- **`/functions/`**: Contains Edge Functions that run on Supabase's servers.
    - **`fetch-all-data/`**: An Edge Function scheduled to run periodically. It fetches the latest data from the "Tech For Palestine" API and saves it into the Supabase database tables. This acts as a data synchronization and caching layer.
    - **`verify-hcaptcha/`**: An Edge Function that securely verifies a user's hCaptcha submission on the server side before a guestbook entry is accepted.

#### 6. `public/` - Static Assets
This folder contains static files that are served directly, such as images used in the `InfrastructureStats` component.

### Data Flow Example (Martyrs Page)

1.  **User navigates to `/martyrs`**.
2.  Next.js renders the server component at `src/app/martyrs/page.tsx`.
3.  `page.tsx` calls the `fetchMartyrs({ page: 1, sort: 'latest' })` server action from `src/app/martyrs/actions.ts`.
4.  `actions.ts` uses the **server** Supabase client (`src/utils/supabase/server.ts`) to query the `martyrs` table in the database for the first page of data.
5.  The data is returned to `page.tsx`.
6.  `page.tsx` renders `<MartyrsPageWrapper />` and passes the fetched `initialMartyrs` data as a prop.
7.  `<MartyrsPageWrapper />` is a client component that dynamically loads `<MartyrsClientPage />` (the main interactive component).
8.  `<MartyrsClientPage />` receives the initial data and displays it. When the user clicks "Load More", it calls the `fetchMartyrs` server action again with the next page number, fetches new data, and appends it to its state, all without a full page reload.

This architecture leverages the strengths of both server and client rendering to create a fast, scalable, and interactive user experience.
