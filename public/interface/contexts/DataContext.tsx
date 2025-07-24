
// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { Event, Entry } from '../types';

interface DataContextType {
  events: Event[];
  pastEvents: Event[];
  entries: Entry[];
  loading: boolean;
  getEventById: (id: string) => Event | undefined;
  getEntriesByEventId: (eventId: string) => Entry[];
  getEntryById: (id: string) => Entry | undefined;
  updateEntryDoneStatus: (id: string, done: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch the API key from a secure endpoint.
        // This endpoint should verify the user's session before returning the key.
        const apiKeyResponse = await fetch('../../get-key.php');
        // const apiKeyResponse = await fetch('/config/www/scheduler/public/get-key.php');
        if (!apiKeyResponse.ok) {
          const errorResult = await apiKeyResponse.json();
          throw new Error(errorResult.message || `API Key fetch failed: ${apiKeyResponse.statusText}`);
        }

        const apiKeyResult = await apiKeyResponse.json();
        if (apiKeyResult.status !== 'success' || !apiKeyResult.apiKey) {
          throw new Error(apiKeyResult.message || 'Invalid API key response.');
        }
        const apiKey = apiKeyResult.apiKey;

        // Step 2: Use the fetched API key to get events and entries.
        const [eventsResponse, entriesResponse] = await Promise.all([
          fetch(`../../api.php?api_key=${apiKey}&action=get_events`),
          fetch(`../../api.php?api_key=${apiKey}&action=get_entries`),
        ]);

        if (!eventsResponse.ok) {
          throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
        }
        if (!entriesResponse.ok) {
          throw new Error(`Failed to fetch entries: ${entriesResponse.statusText}`);
        }

        const eventsResult = await eventsResponse.json();
        const entriesResult = await entriesResponse.json();

        if (eventsResult.status !== 'success' || !Array.isArray(eventsResult.data)) {
          throw new Error(eventsResult.message || 'Invalid event data received.');
        }
        if (entriesResult.status !== 'success' || !Array.isArray(entriesResult.data)) {
          throw new Error(entriesResult.message || 'Invalid entry data received.');
        }

        // The API now returns well-structured events.
        const fetchedEvents: Event[] = eventsResult.data;

        // Process raw entries from the API
        const processedEntries: Entry[] = entriesResult.data.map((item: any) => {
          return {
            entry_id: item.entry_id,
            parent_event_id: item.parent_event_id,
            date: item.date,
            studentFirstName: item.student_first_name,
            studentLastName: item.student_last_name,
            reason: item.reason,
            comments: item.comments,
            start_time: item.start_time,
            end_time: item.end_time,
            name: `${item.student_first_name} ${item.student_last_name}`,
            done: false, // Default 'done' status to false
          };
        });

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingEvents = fetchedEvents
          .filter(event => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const pastEventsData = fetchedEvents
          .filter(event => new Date(event.date) < now)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setEvents(upcomingEvents);
        setPastEvents(pastEventsData);
        setEntries(processedEntries);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch schedule data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getEventById = (event_id: string) => events.find(e => e.event_id === event_id) || pastEvents.find(e => e.event_id === event_id);

  const getEntriesByEventId = (parent_event_id: string) => {
    return entries
        .filter(entry => entry.parent_event_id === parent_event_id)
        .sort((a, b) => new Date(a.date_time_added).getTime() - new Date(b.date_time_added).getTime());
  };

  const getEntryById = (entry_id: string) => entries.find(e => e.entry_id === entry_id);

  const updateEntryDoneStatus = (entry_id: string, done: boolean) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.entry_id === entry_id ? { ...entry, done } : entry
      )
    );
  };

  if (error) {
    return <div className="p-4 text-red-500">Error loading data: {error}</div>;
  }

  return (
    <DataContext.Provider value={{ events, pastEvents, entries, loading, getEventById, getEntriesByEventId, getEntryById, updateEntryDoneStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
