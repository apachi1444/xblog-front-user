
// First, let's update the StoreTableRow component to include a toggle button
import { useState } from 'react';
import { format } from 'date-fns';

import { Box } from '@mui/material';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// Platform images mapping
const PLATFORM_IMAGES = {
  wordpress: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/512px-WordPress_blue_logo.svg.png',
  shopify: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/512px-Shopify_logo_2018.svg.png',
  wix: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Wix.com_website_logo.svg/512px-Wix.com_website_logo.svg.png',
  default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png',
};


// Helper function to get platform image
const getPlatformImage = (platform: string): string => {
  const platformKey = platform?.toLowerCase() as keyof typeof PLATFORM_IMAGES;
  return PLATFORM_IMAGES[platformKey] || PLATFORM_IMAGES.default;
};

// Helper function to capitalize platform name
const getPlatformDisplayName = (platform: string): string => {
  if (!platform) return 'Unknown';
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};

// ----------------------------------------------------------------------

// Define and export the StoreProps interface
export interface StoreProps {
  id: number;
  name: string;
  platform: string;
  business: string;
  creationDate: string | Date;
  articlesCount: number;
  isConnected: boolean;
}

// ----------------------------------------------------------------------

type Props = {
  row: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDelete: (id: number) => void;
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
  isDeleting: boolean;
  isDisconnecting: boolean;
  isReconnecting: boolean;
};

export function StoreTableRow({
  row,
  selected,
  onSelectRow,
  onDelete,
  onDisconnect,
  onReconnect,
  isDeleting,
  isDisconnecting,
  isReconnecting,
}: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [connectionAction, setConnectionAction] = useState<'connect' | 'disconnect'>('disconnect');
  
  const { id, name, platform, business, creationDate, articlesCount, isConnected } = row;

  const handleConnectionToggle = () => {
    setConnectionAction(isConnected ? 'disconnect' : 'connect');
    setOpenConnectionDialog(true);
  };

  const handleConfirmConnection = () => {
    if (connectionAction === 'connect') {
      onReconnect(id);
    } else {
      onDisconnect(id);
    }
    setOpenConnectionDialog(false);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setOpenDeleteDialog(false);
  };

  const isActionLoading = isDeleting || isDisconnecting || isReconnecting;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={getPlatformImage(platform)}
              alt={getPlatformDisplayName(platform)}
              sx={{
                width: 24,
                height: 24,
                objectFit: 'contain',
                borderRadius: 0.5,
              }}
            />
            <Typography variant="body2" noWrap>
              {getPlatformDisplayName(platform)}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>{business}</TableCell>

        <TableCell>{format(new Date(creationDate), 'dd MMM yyyy')}</TableCell>

        <TableCell align="center">{articlesCount}</TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={isConnected ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title={isConnected ? "Disconnect store" : "Connect store"}>
            <Switch
              checked={isConnected}
              onChange={handleConnectionToggle}
              color="success"
              disabled={isActionLoading}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={handleDeleteClick}
              disabled={isActionLoading}
            >
              {isDeleting ? (
                <CircularProgress size={24} />
              ) : (
                <Iconify icon="solar:trash-bin-trash-bold" />
              )}
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this website? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Connection Toggle Confirmation Dialog */}
      <Dialog
        open={openConnectionDialog}
        onClose={() => setOpenConnectionDialog(false)}
      >
        <DialogTitle>
          {connectionAction === 'connect' ? 'Connect Website' : 'Disconnect Website'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {connectionAction === 'connect'
              ? 'Are you sure you want to reconnect this website? This will restore the connection to your store.'
              : 'Are you sure you want to disconnect this website? This will temporarily disable the connection to your store.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConnectionDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmConnection} 
            color={connectionAction === 'connect' ? 'success' : 'warning'} 
            variant="contained"
          >
            {connectionAction === 'connect' ? 'Connect' : 'Disconnect'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
