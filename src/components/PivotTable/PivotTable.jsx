import React from 'react';
import './PivotTable.css';

const aggregate = (values, type) => {
  const nums = values.map(Number).filter(v => !isNaN(v));
  if (nums.length === 0) return '';
  switch (type.toLowerCase()) {
    case 'sum': return nums.reduce((a, b) => a + b, 0).toFixed(2);
    case 'count': return nums.length;
    case 'avg': return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2);
    default: return '';
  }
};

const PivotTable = ({ data, rows, columns, values }) => {
  const pivotData = {};
  const rowKeysSet = new Set();
  const colKeysSet = new Set();
  const grandTotal = {};

  data.forEach(row => {
    const rowKey = rows.length > 0 ? JSON.stringify(rows.map(f => row[f])) : '';
    const colKey = columns.length > 0 ? JSON.stringify(columns.map(f => row[f])) : '';

    rowKeysSet.add(rowKey);
    colKeysSet.add(colKey);

    const cellKey = `${rowKey}|${colKey}`;
    if (!pivotData[cellKey]) pivotData[cellKey] = {};
    values.forEach(({ field, agg }) => {
      if (!pivotData[cellKey][field]) pivotData[cellKey][field] = [];
      pivotData[cellKey][field].push(row[field]);

      const grandKey = `${colKey}|${field}|${agg}`;
      if (!grandTotal[grandKey]) grandTotal[grandKey] = [];
      grandTotal[grandKey].push(row[field]);
    });
  });

  const rowCombos = Array.from(rowKeysSet).map(k => k ? JSON.parse(k) : []);
  const colCombos = columns.length > 0 ? Array.from(colKeysSet).map(k => JSON.parse(k)) : [['']];

  const buildColHeaders = () => {
    if (rows.length === 0 && columns.length === 0) return null;

    // Case 1: Only rows (no columns)
    if (columns.length === 0) {
      return (
        <tr>
          {rows.map((rowField, i) => (
            <th key={`row-header-${i}`}>{rowField}</th>
          ))}
          {values.map(({ field, agg }, i) => (
            <th key={`value-header-${i}`}>
              {field} ({agg.toUpperCase()})
            </th>
          ))}
        </tr>
      );
    }

    // Case 2: Normal case with columns
    const headerRows = [];

    // Column grouping headers
    for (let level = 0; level < columns.length; level++) {
      const headerRow = [];
      let prevLabel = null;
      let spanCount = 0;

      for (let i = 0; i < colCombos.length; i++) {
        const label = colCombos[i][level] ?? '';
        const isSame = label === prevLabel;
        
        if (isSame) {
          spanCount++;
        } else {
          if (prevLabel !== null) {
            headerRow.push(
              <th key={`col-header-${level}-${i-spanCount-1}`} colSpan={spanCount * values.length}>
                {prevLabel}
              </th>
            );
          }
          prevLabel = label;
          spanCount = 1;
        }

        if (i === colCombos.length - 1) {
          headerRow.push(
            <th key={`col-header-${level}-${i}`} colSpan={spanCount * values.length}>
              {label}
            </th>
          );
        }
      }

      headerRows.push(
        <tr key={`col-header-row-${level}`}>
          {level === 0 && rows.map((rowField, i) => (
            <th key={`row-header-${i}`} rowSpan={columns.length + 1}>
              {rowField}
            </th>
          ))}
          {headerRow}
        </tr>
      );
    }

    // Value field headers
    const valueHeadersRow = (
      <tr key="value-headers-row">
        {colCombos.map((colCombo, colIndex) => 
          values.map(({ field, agg }, valIndex) => (
            <th key={`value-header-${colIndex}-${valIndex}`}>
              {field} ({agg.toUpperCase()})
            </th>
          ))
        )}
      </tr>
    );

    headerRows.push(valueHeadersRow);
    return headerRows;
  };

  const groupedRows = {};
  rowCombos.forEach((rowCombo) => {
    const groupKey = rowCombo[0] || '';
    if (!groupedRows[groupKey]) {
      groupedRows[groupKey] = [];
    }
    groupedRows[groupKey].push(rowCombo);
  });

  return (
    <div className="pivot-table-container">
      <table className="pivot-table">
        <thead>{buildColHeaders()}</thead>
        <tbody>
          {Object.entries(groupedRows).map(([groupKey, rowGroup], groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {rowGroup.map((rowCombo, rowIndex) => (
                <tr key={`row-${groupIndex}-${rowIndex}`}>
                  {rowIndex === 0 && rows.length > 0 && (
                    <td
                      key={`group-label-${groupIndex}`}
                      rowSpan={rowGroup.length}
                      className="category-cell"
                    >
                      {groupKey}
                    </td>
                  )}
                  {rows.length > 1 && rowCombo.slice(1).map((val, i) => (
                    <td key={`label-${groupIndex}-${rowIndex}-${i}`}>{val}</td>
                  ))}
                  {colCombos.map((colCombo) =>
                    values.map(({ field, agg }) => {
                      const rowKey = rows.length > 0 ? JSON.stringify(rowCombo) : '';
                      const colKey = columns.length > 0 ? JSON.stringify(colCombo) : '';
                      const cellKey = `${rowKey}|${colKey}`;
                      const valuesList = pivotData[cellKey]?.[field] || [];
                      return (
                        <td key={`cell-${rowKey}-${colKey}-${field}`}>
                          {aggregate(valuesList, agg)}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
          
          {/* Grand Total Row */}
          {(columns.length > 0 || values.length > 0) && (
            <tr className="grand-total-row">
              {rows.map((_, i) => (
                <td key={`grand-label-${i}`}></td>
              ))}
              {colCombos.map((colCombo, i) =>
                values.map(({ field, agg }) => {
                  const colKey = columns.length > 0 ? JSON.stringify(colCombo) : '';
                  const key = `${colKey}|${field}|${agg}`;
                  return (
                    <td key={`grand-${i}-${field}`}>
                      {aggregate(grandTotal[key] || [], agg)}
                    </td>
                  );
                })
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PivotTable;