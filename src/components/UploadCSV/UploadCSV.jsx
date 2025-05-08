import React from 'react';
import Papa from 'papaparse';
import './UploadCSV.css';

const UploadCSV = ({ onDataLoaded }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoaded({
          headers: results.meta.fields || [],
          rows: results.data,
        });
      },
      error: (error) => {
        console.error('CSV Parsing Error:', error);
        alert('Failed to parse CSV. Please check the file format.');
      },
    });
  };

  return (
    <div className="upload-container">
      <label htmlFor="csv-upload" className="upload-label">
        Upload CSV File
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="upload-input"
      />
    </div>
  );
};

export default UploadCSV;