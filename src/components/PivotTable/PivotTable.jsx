import React from 'react';
import './PivotTable.css';

const aggregate = (values, type) => {
  const nums = values.map(Number).filter(v => !isNaN(v));
  if (nums.length === 0) return '';
  switch (type.toLowerCase()) {
    case 'sum': return nums.reduce((a, b) => a + b, 0);
    case 'count': return nums.length;
    case 'avg': return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2);
    default: return '';
  }
};

const PivotTable = ({ data, config }) => {
  const { rows: rowFields, columns: colFields, values } = config;

  const pivotMap = {};
  const rowKeys = new Set();
  const colKeys = new Set();

  const grandTotal = {};

  data.forEach(row => {
    const rowKey = rowFields.map(f => row[f]).join(' | ') || 'All';
    const colKey = colFields.map(f => row[f]).join(' | ') || 'All';
    rowKeys.add(rowKey);
    colKeys.add(colKey);

    const cellKey = `${rowKey}|${colKey}`;
    if (!pivotMap[cellKey]) pivotMap[cellKey] = {};

    values.forEach(({ field, agg }) => {
      if (!pivotMap[cellKey][field]) pivotMap[cellKey][field] = [];
      pivotMap[cellKey][field].push(row[field]);

      const grandKey = `${colKey}|${field}|${agg}`;
      if (!grandTotal[grandKey]) grandTotal[grandKey] = [];
      grandTotal[grandKey].push(row[field]);
    });
  });

  const rowList = Array.from(rowKeys).sort();
  const colList = Array.from(colKeys).sort();

  return (
    <div className="pivot-table-container">
      <table className="pivot-table">
        <thead>
          <tr>
            <th>{rowFields.join(' | ') || 'Item'}</th>
            {colList.map(col =>
              values.map(({ field, agg }) => (
                <th key={`${col}-${field}`} className="pivot-header">
                  {col} - {field} ({agg})
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {rowList.map(rowKey => (
            <tr key={rowKey}>
              <td>{rowKey}</td>
              {colList.map(colKey =>
                values.map(({ field, agg }) => {
                  const cellValues = pivotMap[`${rowKey}|${colKey}`]?.[field] || [];
                  return (
                    <td key={`${rowKey}|${colKey}|${field}`}>
                      {aggregate(cellValues, agg)}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
          {/* Grand Total Row */}
          <tr className="grand-total-row">
            <td>Grand Total</td>
            {colList.map(col =>
              values.map(({ field, agg }) => {
                const valuesArr = grandTotal[`${col}|${field}|${agg}`] || [];
                return (
                  <td key={`grand-${col}-${field}`}>
                    {aggregate(valuesArr, agg)}
                  </td>
                );
              })
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PivotTable;
