import React from 'react';
import './PivotBuilder.css';

const PivotBuilder = ({ zones }) => {
  return (
    <div className="pivot-builder">
      <h3>Current Configuration</h3>
      
      <div className="config-display">
        <div className="config-item">
          <strong>Rows:</strong> {zones.rows.join(', ') || 'None'}
        </div>
        
        <div className="config-item">
          <strong>Columns:</strong> {zones.columns.join(', ') || 'None'}
        </div>
        
        <div className="config-item">
          <strong>Filters:</strong> {zones.filters.join(', ') || 'None'}
        </div>
        
        <div className="config-item">
          <strong>Values:</strong>
          {zones.values.length === 0 ? ' None' : (
            <ul>
              {zones.values.map((item, idx) => (
                <li key={idx}>
                  {item.field} ({item.agg})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PivotBuilder;