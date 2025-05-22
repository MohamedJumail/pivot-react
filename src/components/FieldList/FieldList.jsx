import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './FieldList.css';

const FieldList = ({ availableFields, setAvailableFields, zones, setZones }) => {
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceZone = source.droppableId;
    const destZone = destination.droppableId;

    if (sourceZone === destZone) return;

    let item;
    if (sourceZone === 'available') {
      item = availableFields[source.index];
    } else {
      item = zones[sourceZone][source.index];
    }

    // Remove from source
    if (sourceZone === 'available') {
      setAvailableFields(prev => prev.filter((_, i) => i !== source.index));
    } else {
      setZones(prev => ({
        ...prev,
        [sourceZone]: prev[sourceZone].filter((_, i) => i !== source.index)
      }));
    }

    // Add to destination
    if (destZone === 'available') {
      const fieldName = typeof item === 'object' ? item.field : item;
      setAvailableFields(prev => [...prev, fieldName]);
    } else {
      const newItem = destZone === 'values'
        ? { field: typeof item === 'object' ? item.field : item, agg: 'sum' }
        : typeof item === 'object' ? item.field : item;

      setZones(prev => ({
        ...prev,
        [destZone]: [...prev[destZone], newItem]
      }));
    }
  };

  const handleRemoveField = (zoneId, index) => {
    const item = zones[zoneId][index];
    const fieldName = typeof item === 'object' ? item.field : item;

    // Remove from zone
    const newZoneItems = zones[zoneId].filter((_, i) => i !== index);
    setZones(prev => ({ ...prev, [zoneId]: newZoneItems }));

    // Add back to available
    setAvailableFields(prev => [...prev, fieldName]);
  };

  const renderZone = (zoneId, title) => {
    const items = zones[zoneId];
    return (
      <Droppable droppableId={zoneId}>
        {(provided) => (
          <div
            className={`zone ${zoneId}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <h3>{title}</h3>
            {items.map((item, index) => {
              const field = typeof item === 'object' ? item.field : item;
              return (
                <Draggable key={`${zoneId}-${field}`} draggableId={`${zoneId}-${field}`} index={index}>
                  {(provided) => (
                    <div
                      className="field-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <span>{field}</span>

                      {zoneId === 'values' && (
                        <select
                          value={item.agg}
                          onChange={(e) => {
                            const updatedValues = zones.values.map((val, i) =>
                              i === index ? { ...val, agg: e.target.value } : val
                            );
                            setZones({ ...zones, values: updatedValues });
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="sum">SUM</option>
                          <option value="count">COUNT</option>
                          <option value="avg">AVG</option>
                        </select>
                      )}

                      <button
                        className="cancel-btn"
                        onClick={() => handleRemoveField(zoneId, index)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="field-list-container">
        <div className="available-fields-section">
          <Droppable droppableId="available">
            {(provided) => (
              <div
                className="available-fields"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3>Available Fields</h3>
                {availableFields.map((field, index) => (
                  <Draggable key={`available-${field}`} draggableId={`available-${field}`} index={index}>
                    {(provided) => (
                      <div
                        className="field-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {field}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div className="pivot-zones-section">
          {renderZone('rows', 'Rows')}
          {renderZone('columns', 'Columns')}
          {renderZone('values', 'Values')}
        </div>
      </div>
    </DragDropContext>
  );
};

export default FieldList;
