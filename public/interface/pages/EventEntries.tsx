
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import FilterDropdown from '../components/FilterDropdown';
import { Entry } from '../types';

const EventEntries: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { getEventById, getEntriesByEventId, updateEntryDoneStatus, loading } = useData();
  const navigate = useNavigate();

  const event = eventId ? getEventById(eventId) : undefined;
  const entries = eventId ? getEntriesByEventId(eventId) : [];

  const handleRowClick = (entry: Entry) => {
    navigate(`/entry/${entry.id}`);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, entryId: string) => {
    e.stopPropagation();
    updateEntryDoneStatus(entryId, e.target.checked);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: '2-digit' });
    const timePart = date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: true });
    return `${datePart} ${timePart}`;
  };

  const eventDate = event ? new Date(event.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' }) : '';
  const subtitle = event ? `${event.name} (${eventDate})` : 'Loading...';

  return (
    <Layout loading={loading}>
      <Header title="Photography Schedule" subtitle={subtitle} />
      <div className="mt-6 mb-4">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 block">{'<< Back Home'}</Link>
      </div>
      <div className="flex space-x-4 mb-4">
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date Time</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Package</th>
                <th className="py-3 px-6 text-center">Done</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-light">
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(entry)}>
                  <td className="py-4 px-6 text-left whitespace-nowrap">{formatDate(entry.dateTime)}</td>
                  <td className="py-4 px-6 text-left">{entry.name}</td>
                  <td className="py-4 px-6 text-left">{entry.package}</td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-6 w-6 text-green-600 border-gray-400 rounded focus:ring-green-500"
                      checked={entry.done}
                      onChange={(e) => handleCheckboxChange(e, entry.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EventEntries;
