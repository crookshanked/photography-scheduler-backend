
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import UpcomingEventsPage from './pages/UpcomingEventsPage';
import PreviousEventsPage from './pages/PreviousEventsPage';
import EventEntriesPage from './pages/EventEntriesPage';
import EntryDetailPage from './pages/EntryDetailPage';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<UpcomingEventsPage />} />
          <Route path="/previous" element={<PreviousEventsPage />} />
          <Route path="/event-entries/:eventId" element={<EventEntriesPage />} />
          <Route path="/entry/:entryId" element={<EntryDetailPage />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;
