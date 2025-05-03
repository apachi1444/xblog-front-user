import React, { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
} from '@mui/material';

import type { SectionItem } from './DraggableSectionList';

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
      setDescription(section.description || '');
      setContent(section.content || '');
    }
  }, [section]);

  const handleSave = () => {
    if (!section) return;
    
    const updatedSection: SectionItem = {
      ...section,
      title,
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
