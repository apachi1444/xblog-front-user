import type { ArticleSection } from 'src/sections/generate/schemas';

import React from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import {
  Box
} from '@mui/material';

import { SectionBox } from './SectionBox';

interface DraggableSectionListProps {
  sections: ArticleSection[];
  onSectionsChange: (newSections: ArticleSection[]) => void;
  onEditSection?: (section: ArticleSection) => void;
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

  const handleEditClick = (section: ArticleSection) => {
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