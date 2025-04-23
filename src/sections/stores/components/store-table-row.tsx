import type { LabelColor } from 'src/components/label';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/confirm-dialog';

// ----------------------------------------------------------------------

// Define and export the StoreProps interface
export interface StoreProps {
  id: string;
  name: string;
  platform: string;
  business: string;
  creationDate: string | Date;
  articlesCount: number;
  isConnected: boolean;
}

type Props = {
  row: StoreProps;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export function StoreTableRow({ row, selected, onSelectRow, onDelete, isDeleting }: Props) {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openStatusConfirm, setOpenStatusConfirm] = useState(false);

  const { id, name, platform, business, creationDate, articlesCount, isConnected } = row;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenStatusConfirm = () => {
    setOpenStatusConfirm(true);
  };

  const handleCloseStatusConfirm = () => {
    setOpenStatusConfirm(false);
  };

  const handleDelete = () => {
    onDelete(id);
    handleCloseConfirm();
  };

  const handleStatusClick = () => {
    // Only show confirmation if the store is disconnected
    if (!isConnected) {
      handleOpenStatusConfirm();
    }
  };

  const handleStatusConfirm = () => {
    // Use the same delete function for status confirmation
    onDelete(id);
    handleCloseStatusConfirm();
  };

  const handleViewDetails = () => {
    navigate(`/stores/${id}`);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box component="img" 
              src={`/assets/icons/platforms/${platform?.toLowerCase()}.png`} 
              alt={platform}
              sx={{ width: 28, height: 28, borderRadius: '8px' }}
            />
            
            <Box>
              <Link 
                color="inherit" 
                variant="subtitle2" 
                onClick={handleViewDetails}
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                {name}
              </Link>
              
              <Typography variant="body2" color="text.secondary">
                {`${business} business`}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Label variant="soft" color="primary">
            {platform}
          </Label>
        </TableCell>

        <TableCell>{business}</TableCell>

        <TableCell>{fDate(creationDate)}</TableCell>

        <TableCell align="center">{articlesCount}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(isConnected ? 'success' : 'error') as LabelColor}
            sx={{ 
              cursor: !isConnected ? 'pointer' : 'default',
              '&:hover': !isConnected ? { opacity: 0.8 } : {}
            }}
            onClick={!isConnected ? handleStatusClick : undefined}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Tooltip title="Delete">
            <IconButton 
              color="error" 
              onClick={handleOpenConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <CircularProgress size={20} color="error" />
              ) : (
                <Iconify icon="eva:trash-2-outline" />
              )}
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete this website?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="eva:trash-2-outline" />}
          >
            Delete
          </Button>
        }
      />

      {/* Status Confirmation Dialog */}
      <ConfirmDialog
        open={openStatusConfirm}
        onClose={handleCloseStatusConfirm}
        title="Remove Disconnected Website"
        content="This website is disconnected. Would you like to remove it from your list?"
        action={
          <Button 
            onClick={handleStatusConfirm} 
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Remove
          </Button>
        }
      />
    </>
  );
}
