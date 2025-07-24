# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Architecture Overview
To connect this frontend to a database like MariaDB or MySQL, you'll need to create a backend service.

*   **Backend Server**: You'll create a backend application (e.g., using Node.js with Express, or Python with Flask/FastAPI). This server will handle the business logic of your application.
*   **Database Connection**: The backend server will connect to your MariaDB or MySQL database to query and retrieve data.
*   **API Endpoints**: The backend will expose API endpoints (e.g., `/api/events`, `/api/entries`) that your React application will call to get the data it needs.
*   **Frontend (React)**: Your React application will be modified to fetch data from these new API endpoints instead of using the local mock data.

## Step-by-Step Guide
1.  **Create a Backend Server**:
    *   Choose a backend technology stack. A common choice for a React frontend is to use Node.js with the Express framework.
    *   Initialize a new Node.js project in a separate directory (e.g., `server`) within your project root.
    *   Install necessary packages, such as `express`, `mysql2` (the database driver), and `cors` (to handle cross-origin requests).
2.  **Design Your Database Schema**:
    *   Define the structure of your data in the database. For example, you might have an `events` table and an `entries` table.
    *   Create the database and tables in your MariaDB or MySQL instance.
3.  **Implement the Backend API**:
    *   Create an Express server that connects to your database.
    *   Define API endpoints to serve the data. For example, you could create a `GET /api/events/upcoming` endpoint that queries the database for all events with a date in the future.
4.  **Modify Your React Application**:
    *   In your `DataContext.tsx` file, you will replace the static import of `mockData` with a `useEffect` hook that fetches data from your backend API when the component mounts.
    *   You'll need a library like `axios` or the built-in `fetch` API to make the HTTP requests.
    *   You should also add state to handle loading and potential errors during the data fetching process.

    Here is an example of how you might modify `DataContext.tsx`:
    ```typescriptreact
    import React, { createContext, useState, useEffect, useContext } from 'react';
    import { Event } from '../types'; // Your existing type definitions

    // Define the shape of your context data
    interface DataContextProps {
      upcomingEvents: Event[];
      previousEvents: Event[];
      loading: boolean;
      error: string | null;
    }

    // Create the context
    const DataContext = createContext<DataContextProps | undefined>(undefined);

    // Create the provider component
    export const DataProvider: React.FC = ({ children }) => {
      const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
      const [previousEvents, setPreviousEvents] = useState<Event[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const fetchData = async () => {
          try {
            // Replace with your actual backend API URL
            const response = await fetch('http://localhost:3001/api/events');
            if (!response.ok) {
              throw new Error('Data could not be fetched!');
            }
            const data = await response.json();

            // You would likely have separate endpoints for upcoming and previous events
            // This is a simplified example
            const now = new Date();
            setUpcomingEvents(data.filter((event: Event) => new Date(event.date) >= now));
            setPreviousEvents(data.filter((event: Event) => new Date(event.date) < now));
          } catch (error: any) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, []); // The empty dependency array ensures this effect runs only once on mount

      return (
        <DataContext.Provider value={{ upcomingEvents, previousEvents, loading, error }}>
          {children}
        </DataContext.Provider>
      );
    };

    // Custom hook to use the data context
    export const useData = () => {
      const context = useContext(DataContext);
      if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
      }
      return context;
    };
    ```
This approach decouples your frontend from the data source, making your application more scalable and secure. The backend can handle all the database interactions, and the frontend only needs to know about the API endpoints.

How to Use the New API Endpoints
You can now fetch data from your API like this:

Get all events (dates): GET /api.php?api_key=your-key&action=get_events
Get all schedule entries: GET /api.php?api_key=your-key&action=get_entries
Get entries for a specific date: GET /api.php?api_key=your-key&action=get_entries&event_id=2025-06-24
This new structure gives you more control over your data flow and improves the security of your API.

----
Primary Recommendation: Inject the Key via PHP
The most straightforward method is to have PHP inject the API key directly into the HTML document when it's served. This keeps the key out of your version-controlled JavaScript files but makes it available to your React app as soon as it loads.

Here’s how you can implement this:

Step 1: Convert index.html to index.php
Your React application is served from a single HTML file. You'll need to rename it to a PHP file so you can execute PHP code within it.

Rename: /opt/swag/appdata/swag/www/scheduler/public/index.html -> /opt/swag/appdata/swag/www/scheduler/public/index.php
Step 2: Inject the API Key in index.php
Now, add a small PHP script at the top of your new index.php file to include your configuration and a <script> tag in the <head> to expose the key to the browser.

index.php
-0
+7
The code change produced by Gemini cannot be automatically applied. You can manually apply the change or ask Gemini to try again.
<?php require_once __DIR__ . '/../app/config.php'; ?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
    <script>
      // Expose server-side configuration to the browser
      window.VITE_CONFIG = {
        API_KEY: "<?php echo htmlspecialchars($apiKey, ENT_QUOTES, 'UTF-8'); ?>"
      };
    </script>
    <script type="module" crossorigin src="/assets/index-D55z_60M.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-D_iJzCoP.css">
  </head>

(Note: I've based this on a standard Vite build output. Your index.php might look slightly different, but the principle of adding the PHP and <script> tags remains the same.)

Step 3: Update DataContext.tsx to Use the Injected Key
Finally, modify your React context to read the key from the global window object instead of hardcoding it. This makes your component more secure and configurable from the backend.

DataContext.tsx
-2
+8
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Move API_KEY to a secure place, like an environment variable.
  const API_KEY = 'your-super-secret-and-random-api-key';
  // Read the API_KEY from the global window object injected by PHP
  const API_KEY = (window as any).VITE_CONFIG?.API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!API_KEY) {
          setError("API key is missing. It should be injected into the page by the server.");
          setLoading(false);
          return;
        }

        // Fetch both events and entries in parallel using the new API structure
        const [eventsResponse, entriesResponse] = await Promise.all([
          fetch(`/api.php?api_key=${API_KEY}&action=get_events`),

Security Note: With this method, the API key is visible in the page source if a user inspects it. This is perfectly acceptable for keys that are meant to be "publishable" or are used for client-to-server requests to your own backend, as is your case. The main security benefit is that the key is no longer stored in a static file in your web directory or checked into version control.

Alternative (More Secure): Fetching from a Secured Endpoint
If your application had user authentication and the API key was a highly sensitive secret, a more secure pattern would be to fetch it from a PHP endpoint that requires a valid user session.

Create a get-key.php Endpoint: This script would check $_SESSION to see if a user is logged in. If they are, it would respond with the API key as JSON.
Update React App: Your DataContext.tsx would first fetch this endpoint, store the key in its state, and then use that key to make all subsequent calls to api.php.
This approach adds a little complexity and an extra network request, but it ensures the API key is never exposed to unauthenticated users. It's a great pattern to consider if you add user accounts to your scheduler in the future.

