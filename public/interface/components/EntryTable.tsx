
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Entry } from '../types';
import DataTable from 'datatables.net-react';

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
      render: (data: boolean, type: string, row: Entry) => (
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
