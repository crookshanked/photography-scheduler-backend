
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import FilterDropdown from '../components/FilterDropdown';
import EntryTable from '../components/EntryTable';

const EventEntries: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event_id = eventId;
  const { getEventById, getEntriesByEventId, updateEntryDoneStatus, loading } = useData();

  const event = event_id ? getEventById(event_id) : undefined;
  const entries = event_id ? getEntriesByEventId(event_id) : [];

  useEffect(() => {
    console.log('event_id:', event_id);
    console.log('entries:', entries);
  }, [event_id, entries]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, entryId: string) => {
    e.stopPropagation();
    updateEntryDoneStatus(entryId, e.target.checked);
  };

  const eventDate = event ? new Date(event.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' }) : '';
  const subtitle = event ? `${event.name} (${eventDate})` : 'Loading...';

  return (
    <Layout loading={loading}>
      <Header title="Photography Schedule" subtitle={subtitle} />
      <div className="mt-6 mb-4">
        <Link to={`/`} className="text-blue-600 hover:underline text-sm mb-4 block">{'<< Back Home'}</Link>
      </div>
      <div className="flex space-x-4 mb-4">
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
      </div>
      <EntryTable entries={entries} onCheckboxChange={handleCheckboxChange} />
    </Layout>
  );
};


export default EventEntries;