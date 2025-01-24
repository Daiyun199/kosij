import React, { useState } from "react";
import "./Table.css";

interface DynamicTableProps<DataType> {
  columns: Array<{ title: string; dataIndex: string }>;
  data: DataType[];
  actionColumn?: (record: DataType) => React.ReactNode;
}

interface KeyedData {
  key: React.Key;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const DynamicTable = <DataType extends KeyedData>({
  columns,
  data,
  actionColumn,
}: DynamicTableProps<DataType>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="dynamic-table">
      <table className="antd-style-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.dataIndex} className="table-header-cell">
                {col.title}
              </th>
            ))}
            {actionColumn && <th className="table-header-cell">Action</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((record) => (
            <tr key={record.key}>
              {columns.map((col) => (
                <td key={col.dataIndex} className="table-cell">
                  {record[col.dataIndex]}
                </td>
              ))}
              {actionColumn && (
                <td className="table-cell">{actionColumn(record)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-btn ${
              currentPage === page ? "active-page" : ""
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;
