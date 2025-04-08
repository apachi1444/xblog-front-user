import React, { useState } from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import { 
  Box, 
  Stack, 
  Dialog, 
  Button, 
  Divider, 
  MenuItem, 
  TextField, 
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
    setCurrentSection(section);
    setEditTitle(section.title);
    setEditStatus(section.status);
    setEditDescription(section.description || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentSection) return;
    
    const updatedSections = sections.map(section => 
      section.id === currentSection.id 
        ? { ...section, title: editTitle, status: editStatus, description: editDescription } 
        : section
    );
    
    onSectionsChange(updatedSections);
    setEditDialogOpen(false);
    
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

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
  };

  return (
    <>
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

      {/* Edit Dialog - Responsive for both full and mobile */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Edit Section</Typography>
          <Typography variant="body2" color="text.secondary">
            Customize your section details below
          </Typography>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Section Title
            </Typography>
            <TextField
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter section title"
              variant="outlined"
              size={isMobile ? "medium" : "small"}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Status
            </Typography>
            <TextField
              select
              fullWidth
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as "Not Started" | "In Progress" | "Completed")}
              variant="outlined"
              size={isMobile ? "medium" : "small"}
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={isMobile ? 6 : 4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Enter section description or notes"
              variant="outlined"
              size={isMobile ? "medium" : "small"}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit" 
            variant="outlined"
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            startIcon={<Iconify icon="mdi:content-save" />}
            fullWidth={isMobile}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};