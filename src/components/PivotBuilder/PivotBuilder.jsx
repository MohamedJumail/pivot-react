import React from 'react';
import './PivotBuilder.css';

const aggregationOptions = ['sum', 'count', 'avg'];

const PivotBuilder = ({ zones, setZones }) => {
  const handleAggregationChange = (index, newAgg) => {
    const updatedValues = zones.values.map((item, i) => {
      const field = typeof item === 'string' ? item : item.field;
      return i === index ? { field, agg: newAgg } : item;
    });
    setZones({ ...zones, values: updatedValues });
  };

  return (
    <div className="pivot-builder">
      <h3>Pivot Configuration</h3>

      <div className="pivot-section">
        <strong>Rows:</strong> {zones.rows.join(', ') || 'None'}
      </div>

      <div className="pivot-section">
        <strong>Columns:</strong> {zones.columns.join(', ') || 'None'}
      </div>

      <div className="pivot-section">
        <strong>Filters:</strong> {zones.filters.join(', ') || 'None'}
      </div>

      <div className="pivot-section">
        <strong>Values:</strong>
        {zones.values.length === 0 ? ' None' : (
          zones.values.map((item, idx) => {
            const field = typeof item === 'string' ? item : item.field;
            const agg = typeof item === 'string' ? 'sum' : item.agg || 'sum';
            return (
              <div key={idx} className="value-field">
                {field}
                <select
                  value={agg}
                  onChange={(e) => handleAggregationChange(idx, e.target.value)}
                >
                  {aggregationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PivotBuilder;
