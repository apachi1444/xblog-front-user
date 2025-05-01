import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SectionItem } from './DraggableSectionList';

interface SectionEditDialogProps {
  open: boolean;
  section: SectionItem | null;
  onClose: () => void;
  onSave: (updatedSection: SectionItem) => void;
}

export const SectionEditDialog: React.FC<SectionEditDialogProps> = ({
  open,
  section,
  onClose,
  onSave,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<"Not Started" | "In Progress" | "Completed">("Not Started");
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setStatus(section.status);
      setDescription(section.description || '');
      setContent(section.content || '');
    }
  }, [section]);

  const handleSave = () => {
    if (!section) return;
    
    const updatedSection: SectionItem = {
      ...section,
      title,
      status,
      description,
      content,
    };
    
    onSave(updatedSection);
    onClose();
  };

  if (!section) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.customShadows.dialog,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5">Edit Section</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Customize your section details and content
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
          <TextField
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
          />
          
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value as "Not Started" | "In Progress" | "Completed")}
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Brief description of this section"
          />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Section Content
            </Typography>
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              rows={10}
              variant="outlined"
              placeholder="Write your section content here..."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!title.trim()}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
