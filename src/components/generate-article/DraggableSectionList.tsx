import React, { useState } from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import { 
  Box
} from '@mui/material';

import { SectionBox } from './SectionBox';

// Add the content property to the SectionItem interface
export interface SectionItem {
  id: string;
  title: string;
  description?: string;
  content?: string; // Add this line to include the content property
}

interface DraggableSectionListProps {
  sections: SectionItem[];
  onSectionsChange: (newSections: SectionItem[]) => void;
  onEditSection?: (section: SectionItem) => void;
  onDeleteSection?: (sectionId: string) => void;
}

export const DraggableSectionList: React.FC<DraggableSectionListProps> = ({
  sections,
  onSectionsChange,
  onEditSection,
  onDeleteSection
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onSectionsChange(items);
  };

  const handleEditClick = (section: SectionItem) => {
    if (onEditSection) {
      onEditSection(section);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ width: '100%' }}
            >
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(providedd) => (
                    <Box
                      ref={provided.innerRef}
                      {...providedd.draggableProps}
                      sx={{ mb: 2 }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Box sx={{ pl: 4 }}>
                          <SectionBox 
                            section={section}
                            onEditSection={handleEditClick}
                            onDeleteSection={onDeleteSection}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
  );
};