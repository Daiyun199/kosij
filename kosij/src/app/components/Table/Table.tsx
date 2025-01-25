"use client";
import React, { useState } from "react";
import "./Table.css";

interface DynamicTableProps<DataType> {
  columns: Array<{
    title: string;
    dataIndex: string;
    filters?: { text: string; value: string }[];
    onFilter?: (value: string, record: DataType) => boolean;
  }>;
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
  const [filters, setFilters] = useState<{ [key: string]: string | null }>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const pageSize = 5;

  const filteredData = data.filter((record) => {
    const matchesSearch = Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    );

    const matchesFilters = Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      const column = columns.find((col) => col.dataIndex === key);
      const onFilter = column?.onFilter;
      if (onFilter) {
        return onFilter(filters[key] as string, record);
      }
      return true;
    });

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (dataIndex: string, value: string | null) => {
    setFilters({ ...filters, [dataIndex]: value });
    setCurrentPage(1);
  };

  const toggleFilterMenu = (dataIndex: string) => {
    setActiveFilter(activeFilter === dataIndex ? null : dataIndex);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="dynamic-table">
      <div className="table-wrapper">
        <div className="table-controls flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchChange}
            className="search-input p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <table className="antd-style-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.dataIndex} className="table-header-cell">
                  <div className="flex items-center justify-between">
                    <span>{col.title}</span>
                    {col.filters && (
                      <div className="relative">
                        <button
                          className="filter-icon"
                          onClick={() => toggleFilterMenu(col.dataIndex)}
                          title="Filter"
                        >
                          <i
                            className="fa-solid fa-filter"
                            style={{ color: "black" }}
                          ></i>
                        </button>
                        <div
                          className={`filter-menu ${
                            activeFilter === col.dataIndex ? "show" : ""
                          }`}
                        >
                          <ul>
                            {col.filters.map((filter) => (
                              <li key={filter.value}>
                                <label>
                                  <input
                                    type="radio"
                                    name={col.dataIndex}
                                    value={filter.value}
                                    checked={
                                      filters[col.dataIndex] === filter.value
                                    }
                                    onChange={() =>
                                      handleFilterChange(
                                        col.dataIndex,
                                        filter.value
                                      )
                                    }
                                  />
                                  {filter.text}
                                </label>
                              </li>
                            ))}
                            <li>
                              <button
                                onClick={() =>
                                  handleFilterChange(col.dataIndex, null)
                                }
                                className="clear-btn"
                              >
                                Clear
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
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
      </div>

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
