import React, { useState } from 'react';
import UploadCSV from './components/UploadCSV/UploadCSV';
import RawDataTable from './components/RawDataTable/RawDataTable';
import PivotTable from './components/PivotTable/PivotTable';
import FieldList from './components/FieldList/FieldList';
import './App.css';

const App = () => {
  const [csvData, setCsvData] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [zones, setZones] = useState({
    rows: [],
    columns: [],
    values: [],
  });

  const handleDataLoaded = (parsed) => {
    setCsvData(parsed);
    setAvailableFields(parsed.headers || []);
    setZones({
      rows: [],
      columns: [],
      values: [],
    });
  };

  const hasPivotConfig = zones.rows.length > 0 || zones.columns.length > 0 || zones.values.length > 0;

  return (
    <div className="App">
      <h1 className="app-title">React Pivot Table</h1>
      <UploadCSV onDataLoaded={handleDataLoaded} />

      {csvData && (
        <div className="main-content">
          <div className="table-container">
            {hasPivotConfig ? (
              <PivotTable 
                data={csvData.rows} 
                rows={zones.rows} 
                columns={zones.columns} 
                values={zones.values} 
              />
            ) : (
              <RawDataTable headers={csvData.headers} rows={csvData.rows} />
            )}
          </div>
          
          <div className="fields-container">
            <FieldList
              availableFields={availableFields}
              setAvailableFields={setAvailableFields}
              zones={zones}
              setZones={setZones}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;