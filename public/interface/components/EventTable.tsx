
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import jszip from 'jszip';
import pdfmake from 'pdfmake';
import DataTable from 'datatables.net-react';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-colreorder-dt';
import 'datatables.net-columncontrol-dt';

import 'datatables.net-fixedcolumns-dt';
import 'datatables.net-fixedheader-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-searchbuilder-dt';
import 'datatables.net-searchpanes-dt';

DataTablesCore.Buttons.jszip(jszip);
DataTablesCore.Buttons.pdfMake(pdfmake);
DataTable.use(DataTablesCore);

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
