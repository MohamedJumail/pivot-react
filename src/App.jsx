import React, { useState } from 'react';
import UploadCSV from './components/UploadCSV/UploadCSV';
import FieldList from './components/FieldList/FieldList';
import RawDataTable from './components/RawDataTable/RawDataTable';
import PivotBuilder from './components/PivotBuilder/PivotBuilder';
import PivotTable from './components/PivotTable/PivotTable';
import './App.css';

const App = () => {
  const [csvData, setCsvData] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [zones, setZones] = useState({
    rows: [],
    columns: [],
    filters: [],
    values: [],
  });

  const handleDataLoaded = (parsed) => {
    setCsvData(parsed);
    setAvailableFields(parsed.headers || []);
    setZones({ rows: [], columns: [], filters: [], values: [] });
  };

  return (
    <div className="App">
      <h1 className="app-title">React Pivot Table</h1>
      <UploadCSV onDataLoaded={handleDataLoaded} />

      {csvData && (
        <>
          <RawDataTable headers={csvData.headers} rows={csvData.rows} />
          <FieldList
            availableFields={availableFields}
            setAvailableFields={setAvailableFields}
            zones={zones}
            setZones={setZones}
          />
          <PivotBuilder zones={zones} setZones={setZones} />
          <PivotTable data={csvData.rows} config={zones} />
        </>
      )}
    </div>
  );
};

export default App