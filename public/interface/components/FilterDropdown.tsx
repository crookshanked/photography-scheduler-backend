
import React from 'react';

const FilterDropdown: React.FC = () => {
  return (
    <div className="relative inline-block text-left">
      <select className="appearance-none bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-gray-500 dark:focus:border-gray-500">
        <option>Filter by...</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default FilterDropdown;
