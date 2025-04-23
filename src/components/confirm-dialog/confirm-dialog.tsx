import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

interface ConfirmDialogProps {
  title: React.ReactNode;
  content: React.ReactNode;
  action: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
}

export function ConfirmDialog({ title, content, action, open, onClose }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { width: 'auto', maxWidth: 480 } }}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent sx={{ typography: 'body2' }}>
        {typeof content === 'string' ? <Typography variant="body1">{content}</Typography> : content}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        {action}
      </DialogActions>
    </Dialog>
  );
}