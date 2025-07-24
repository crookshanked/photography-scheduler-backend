
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Entry } from '../types';
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

interface EntryTableProps {
  entries: Entry[];
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>, entryId: string) => void;
}

const EntryTable: React.FC<EntryTableProps> = ({ entries, onCheckboxChange }) => {
  const navigate = useNavigate();

  const handleRowClick = (entryId: string) => {
    navigate(`/entry-detail/${entryId}`);
  };

  const columns = [
    { title: 'Name', data: 'name' },
    { title: 'Position', data: 'position' },
    { title: 'Number', data: 'car_number' },
    { title: 'Class', data: 'class_name' },
    {
      title: 'Done',
      data: 'done',
      render: (data: boolean, _type: string, row: Entry) => (
        <input
          type="checkbox"
          className="form-checkbox h-6 w-6 text-green-600 border-gray-400 rounded focus:ring-green-500"
          checked={data}
          onChange={(e) => onCheckboxChange(e, row.entry_id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <DataTable
        data={entries}
        columns={columns}
        className="min-w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg"
        onRowClick={(rowData: Entry) => handleRowClick(rowData.entry_id)}
      />
    </div>
  );
};

export default EntryTable;
