
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import FilterDropdown from '../components/FilterDropdown';
import EventTable from '../components/EventTable';

const UpcomingEventsPage: React.FC = () => {
  const { events, loading } = useData();

  return (
    <Layout loading={loading}>
      <Header title="Photography Schedule" />
      <div className="mt-6 mb-4">
        <h3 className="text-2xl font-light text-gray-700">Upcoming Event List</h3>
      </div>
      <div className="flex space-x-4 mb-4">
        <FilterDropdown />
        <FilterDropdown />
        <FilterDropdown />
      </div>
      <EventTable events={events} />
      <div className="mt-8 text-center">
        <Link to="/previous" className="text-blue-600 hover:underline">View Previous Events</Link>
      </div>
    </Layout>
  );
};

export default UpcomingEventsPage;
