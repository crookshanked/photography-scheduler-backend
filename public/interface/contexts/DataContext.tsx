
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api.php');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        if (result.status === 'success' && Array.isArray(result.data)) {
          const rawEntries = result.data;

          // Process raw data into events (grouped by date) and entries
          const eventsMap = new Map<string, Event>();
          const processedEntries: Entry[] = rawEntries.map((item: any) => {
            // Create or get the event for this date
            if (!eventsMap.has(item.date)) {
              eventsMap.set(item.date, {
                id: item.id, // Use date as a unique event ID
                name: item.name,
                location: item.location,
                date: item.date
              });
            }

            // Create the entry, mapping API fields to the Entry type
            return {
              id: item.id,
              eventId: item.date,
              studentFirstName: item.student_first_name,
              studentLastName: item.student_last_name,
              reason: item.reason,
              comments: item.comments,
              dateTime: `${item.date}T${item.start_time}`,
              done: false, // Default 'done' status to false
            };
          });

          setEvents(Array.from(eventsMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
          setEntries(processedEntries);
        } else {
          throw new Error(result.message || 'Failed to fetch data.');
        }
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
