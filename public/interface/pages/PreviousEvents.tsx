
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import FilterDropdown from '../components/FilterDropdown';
import { Event } from '../types';

const PreviousEvents: React.FC = () => {
  const { events, loading } = useData();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const previousEvents = events
    .filter(event => event.date < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleRowClick = (event: Event) => {
    navigate(`/event/${event.id}`);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <Layout loading={loading}>
      <Header title="Photography Schedule" />
      <div className="mt-6 mb-4">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 block">{'<< Back Home'}</Link>
        <h3 className="text-2xl font-light text-gray-700">Previous Event List</h3>
      </div>
      <div className="flex space-x-4 mb-4">
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Event</th>
                <th className="py-3 px-6 text-left">Location</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm font-light">
              {previousEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(event)}>
                  <td className="py-4 px-6 text-left whitespace-nowrap">{formatDate(event.date)}</td>
                  <td className="py-4 px-6 text-left">{event.name}</td>
                  <td className="py-4 px-6 text-left">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default PreviousEvents;
