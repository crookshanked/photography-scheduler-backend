
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import FilterDropdown from '../components/FilterDropdown';
import EventTable from '../components/EventTable';

const PreviousEventsPage: React.FC = () => {
  const { pastEvents, loading } = useData();

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
      <EventTable events={pastEvents} />
    </Layout>
  );
};

export default PreviousEventsPage;
