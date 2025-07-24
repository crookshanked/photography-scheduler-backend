
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';

interface EventTableProps {
  events: Event[];
}

const EventTable: React.FC<EventTableProps> = ({ events }) => {
  const navigate = useNavigate();

  const handleRowClick = (eventId: string) => {
    navigate(`/event-entries/${eventId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-400 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Location</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
          {events.map(event => (
            <tr 
              key={event.event_id} 
              className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleRowClick(event.event_id)}
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">{event.date}</td>
              <td className="py-3 px-6 text-left">{event.name}</td>
              <td className="py-3 px-6 text-left">
                <div className="whitespace-pre-wrap">{event.location}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
