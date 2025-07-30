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
    console.log("handleRowClick(): ");
    console.log(eventId);
    navigate(`/event-entries/${eventId}`);
  };
  // console.log('events: ');
  // console.log(events);
  const columns = [
    { title: 'Date', data: 'date' },
    { title: 'Name', data: 'name' },
    { title: 'Location', data: 'location' },
    {
      title: 'Actions',
      data: 'event_id',
      render: (data, type, row) => {
        return `<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded view-entries-btn" data-event-id="${row.event_id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16"><path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" fill="white"/></svg></button>`;
      },
      createdCell: (cell, cellData, rowData) => {
        const button = cell.querySelector('.view-entries-btn');
        if (button) {
          button.addEventListener('click', () => {
            handleRowClick(rowData.event_id);
          });
        }
      }
    },
  ];
  // console.log('events: ');
  // console.log(events);
  // console.log("columns: ");
  // console.log(columns);
  return (
    <div className="overflow-x-auto">
      <DataTable
        data={events}
        columns={columns}
        options={{
          language: {
            search: 'Search:',
            searchPlaceholder: "Name, Date, or Location",
            columnControl: {
              colVis: undefined,
              colVisDropdown: undefined,
              dropdown: undefined,
              orderAddAsc: undefined,
              orderAddDesc: undefined,
              orderAsc: "Sort Asc",
              orderClear: undefined,
              orderDesc: "Sort Desc",
              orderRemove: undefined,
              reorder: undefined,
              reorderLeft: undefined,
              reorderRight: undefined,
              searchClear: undefined,
              searchDropdown: undefined,
              searchList: undefined,
              spacer: undefined,
              list: undefined,
              search: undefined
            }
          },
          responsive: true,
          dom: 'Bfrtip',
          buttons: [
            'excel', 'pdf'
          ],
        }}
        className="min-w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg"
      />
    </div>
  );
};
console.log("EventTable: ");
console.log(EventTable);
export default EventTable;