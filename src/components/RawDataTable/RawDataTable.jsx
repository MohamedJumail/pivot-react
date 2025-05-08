import React from 'react';
import './RawDataTable.css';

const RawDataTable = ({ headers, rows }) => {
  if (!headers || headers.length === 0 || !rows || rows.length === 0) {
    return <div className="raw-table-empty">No data to display.</div>;
  }

  return (
    <div className="raw-table-wrapper">
      <h3>CSV Data Preview</h3>
      <div className="raw-table-scroll">
        <table className="raw-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawDataTable;
