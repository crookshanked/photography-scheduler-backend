
// import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { Event, Entry } from '../types';

interface DataContextType {
  events: Event[];
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
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          fetch(`/api.php?api_key=${API_KEY}&action=get_entries`),
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
            id: item.id,
            eventId: item.date, // eventId is the date, linking it to an Event
            studentFirstName: item.student_first_name,
            studentLastName: item.student_last_name,
            reason: item.reason,
            comments: item.comments,
            dateTime: `${item.date}T${item.start_time}`,
            done: false, // Default 'done' status to false
          };
        });

        setEvents(fetchedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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

  const getEventById = (id: string) => events.find(e => e.id === id);

  const getEntriesByEventId = (eventId: string) => {
    return entries
        .filter(entry => entry.eventId === eventId)
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  };

  const getEntryById = (id: string) => entries.find(e => e.id === id);

  const updateEntryDoneStatus = (id: string, done: boolean) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, done } : entry
      )
    );
  };

  if (error) {
    return <div className="p-4 text-red-500">Error loading data: {error}</div>;
  }

  return (
    <DataContext.Provider value={{ events, entries, loading, getEventById, getEntriesByEventId, getEntryById, updateEntryDoneStatus }}>
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
