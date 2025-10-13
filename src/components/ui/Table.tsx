import React from 'react';

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, data, renderRow }) => {
  return (
    <table className="min-w-full border">
      <thead className="bg-primary-100 text-left">
        <tr>
          {headers.map((h) => (
            <th key={h} className="px-4 py-2 border-b">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={headers.length} className="px-4 py-2 text-center">
              No data available
            </td>
          </tr>
        )}
        {data.map((d) => (
          <tr key={d.id} className="hover:bg-gray-50">{renderRow(d)}</tr>
        ))}
      </tbody>
    </table>
  );
};