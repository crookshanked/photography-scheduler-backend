
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import UpcomingEvents from './pages/UpcomingEvents';
import PreviousEvents from './pages/PreviousEvents';
import EventEntries from './pages/EventEntries';
import EntryDetail from './pages/EntryDetail';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<UpcomingEvents />} />
          <Route path="/previous" element={<PreviousEvents />} />
          <Route path="/event/:eventId" element={<EventEntries />} />
          <Route path="/entry/:entryId" element={<EntryDetail />} />
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;
