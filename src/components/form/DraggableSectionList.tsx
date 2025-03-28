import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Stack } from '@mui/material';
import { SectionBox } from './SectionBox';

export interface SectionItem {
  id: string;
  title: string;
  status: "Not Started" | "In Progress" | "Completed";
}

interface DraggableSectionListProps {
  sections: SectionItem[];
  onSectionsChange: (newSections: SectionItem[]) => void;
}

export const DraggableSectionList: React.FC<DraggableSectionListProps> = ({
  sections,
  onSectionsChange
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onSectionsChange(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sections">
        {(pro : any) => (
          <Box
            {...pro.droppableProps}
            ref={pro.innerRef}
            sx={{ width: '100%' }}
          >
            <Stack spacing={2}>
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided : any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SectionBox
                        sectionTitle={section.title}
                        status={section.status}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {pro.placeholder}
            </Stack>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};