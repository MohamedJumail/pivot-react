export function generatePivotMatrix(data, zones) {
    const { rows, columns, values } = zones;
    if (!data || rows.length === 0 || columns.length === 0 || values.length === 0) return [];
  
    const valueFields = values.map(v =>
      typeof v === 'string' ? { field: v, agg: 'sum' } : { field: v.field, agg: v.agg || 'sum' }
    );
  
    const rowKeyField = rows[0];
    const colKeyField = columns[0];
  
    const matrix = new Map();
    const colKeysSet = new Set();
  
    for (const row of data) {
      const rowKey = row[rowKeyField] || '∅';
      const colKey = row[colKeyField] || '∅';
      colKeysSet.add(colKey);
  
      if (!matrix.has(rowKey)) {
        matrix.set(rowKey, { columns: new Map(), totals: {} });
      }
  
      const rowEntry = matrix.get(rowKey);
      if (!rowEntry.columns.has(colKey)) {
        rowEntry.columns.set(colKey, {});
      }
  
      const cell = rowEntry.columns.get(colKey);
  
      for (const { field, agg } of valueFields) {
        const rawValue = parseFloat(row[field]);
        const value = isNaN(rawValue) ? 0 : rawValue;
        const label = `${field} (${agg.toUpperCase()})`;
  
        if (agg === 'sum') {
          cell[label] = (cell[label] || 0) + value;
          rowEntry.totals[label] = (rowEntry.totals[label] || 0) + value;
        }
  
        if (agg === 'count') {
          cell[label] = (cell[label] || 0) + 1;
          rowEntry.totals[label] = (rowEntry.totals[label] || 0) + 1;
        }
  
        if (agg === 'avg') {
          cell[label] = (cell[label] || 0) + value;
          cell[`__count_${label}`] = (cell[`__count_${label}`] || 0) + 1;
  
          rowEntry.totals[label] = (rowEntry.totals[label] || 0) + value;
          rowEntry.totals[`__count_${label}`] = (rowEntry.totals[`__count_${label}`] || 0) + 1;
        }
      }
    }
  
    // Finalize AVG and round all values to 2 decimals
    for (const rowEntry of matrix.values()) {
      for (const colCell of rowEntry.columns.values()) {
        for (const key of Object.keys(colCell)) {
          if (key.startsWith('__count_')) continue;
          const countKey = `__count_${key}`;
          if (countKey in colCell) {
            colCell[key] = Math.round((colCell[key] / colCell[countKey]) * 100) / 100;
            delete colCell[countKey];
          } else {
            colCell[key] = Math.round(colCell[key] * 100) / 100;
          }
        }
      }
  
      for (const key of Object.keys(rowEntry.totals)) {
        if (key.startsWith('__count_')) continue;
        const countKey = `__count_${key}`;
        if (countKey in rowEntry.totals) {
          rowEntry.totals[key] = Math.round((rowEntry.totals[key] / rowEntry.totals[countKey]) * 100) / 100;
          delete rowEntry.totals[countKey];
        } else {
          rowEntry.totals[key] = Math.round(rowEntry.totals[key] * 100) / 100;
        }
      }
    }
  
    return {
      rowKeys: Array.from(matrix.keys()),
      colKeys: Array.from(colKeysSet),
      valueLabels: valueFields.map(({ field, agg }) => `${field} (${agg.toUpperCase()})`),
      matrix
    };
  }
  