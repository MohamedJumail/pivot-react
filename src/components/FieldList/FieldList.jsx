import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './FieldList.css';

const FieldList = ({ availableFields, setAvailableFields, zones, setZones }) => {
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = source.droppableId === 'available' ? [...availableFields] : [...zones[source.droppableId]];
    const destList = destination.droppableId === 'available' ? [...availableFields] : [...zones[destination.droppableId]];

    const [movedItem] = sourceList.splice(source.index, 1);

    const normalizeItem = (item, zone) => {
      if (zone === 'values') {
        return typeof item === 'string' ? { field: item, agg: 'sum' } : item;
      }
      return typeof item === 'object' ? item.field : item;
    };

    destList.splice(destination.index, 0, normalizeItem(movedItem, destination.droppableId));

    // Update source
    if (source.droppableId === 'available') {
      setAvailableFields(sourceList);
    } else {
      setZones(prev => ({ ...prev, [source.droppableId]: sourceList }));
    }

    // Update destination
    if (destination.droppableId === 'available') {
      // If coming from values zone, extract just the field name
      const cleanedList = destList.map(i => typeof i === 'object' ? i.field : i);
      setAvailableFields(cleanedList);
    } else {
      setZones(prev => ({ ...prev, [destination.droppableId]: destList }));
    }
  };

  const renderZone = (id, label) => (
    <Droppable droppableId={id} key={id}>
      {(provided) => (
        <div className="zone" ref={provided.innerRef} {...provided.droppableProps}>
          <strong>{label}</strong>
          {zones[id].map((item, idx) => {
            const field = typeof item === 'object' ? item.field : item;
            const text = typeof item === 'object' ? `${item.field} (${item.agg})` : item;
            return (
              <Draggable key={`${id}-${field}`} draggableId={`${id}-${field}-${idx}`} index={idx}>
                {(provided) => (
                  <div
                    className="field-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {text}
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="fieldlist-container">
        <Droppable droppableId="available">
          {(provided) => (
            <div
              className="available-fields"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <h3>Available Fields</h3>
              {availableFields.map((field, idx) => (
                <Draggable key={`available-${field}`} draggableId={`available-${field}`} index={idx}>
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

        <div className="pivot-zones">
          {renderZone('rows', 'Rows')}
          {renderZone('columns', 'Columns')}
          {renderZone('filters', 'Filters')}
          {renderZone('values', 'Values')}
        </div>
      </div>
    </DragDropContext>
  );
};

export default FieldList;
