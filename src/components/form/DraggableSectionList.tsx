import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import { 
  Box, 
  useTheme
} from '@mui/material';

import { SectionBox } from './SectionBox';

export interface SectionItem {
  id: string;
  title: string;
  status: "Not Started" | "In Progress" | "Completed";
  description?: string;
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
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<SectionItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStatus, setEditStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started");
  const [editDescription, setEditDescription] = useState('');

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onSectionsChange(items);
  };

  const handleEditClick = (section: SectionItem) => {
    // Navigate to the edit section page with the section ID
    navigate(`/edit-section/${section.id}`);
    
    // We still set the current section in case we need it
    setCurrentSection(section);
    setEditTitle(section.title);
    setEditStatus(section.status);
    setEditDescription(section.description || '');
    
    // Call the parent's onEditSection if provided
    if (onEditSection) {
      onEditSection(section);
    }
  };

  const handleSaveEdit = () => {
    if (!currentSection) return;
    
    const updatedSections = sections.map(section => 
      section.id === currentSection.id 
        ? { ...section, title: editTitle, status: editStatus, description: editDescription } 
        : section
    );
    
    onSectionsChange(updatedSections);
    
    // Call the parent's onEditSection if provided
    if (onEditSection) {
      onEditSection({
        ...currentSection,
        title: editTitle,
        status: editStatus,
        description: editDescription
      });
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