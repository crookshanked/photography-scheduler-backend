
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import DataTable from 'datatables.net-react';


interface EventTableProps {
  events: Event[];
}

const EventTable: React.FC<EventTableProps> = ({ events }) => {
  const navigate = useNavigate();

  const handleRowClick = (eventId: string) => {
    navigate(`/event-entries/${eventId}`);
  };

  const columns = [
    { title: 'Date', data: 'date' },
    { title: 'Name', data: 'name' },
    { title: 'Location', data: 'location' },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable
        data={events}
        columns={columns}
        className="min-w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg"
        onRowClick={(rowData: Event) => handleRowClick(rowData.event_id)}
      />
    </div>
  );
};

export default EventTable;
