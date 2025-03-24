import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export type StoreProps = {
  id: string;
  name: string;
  url: string;
  logo: string;
  platform?: string;
  business?: string;
  creationDate?: string;
  articlesCount: number;
  isConnected: boolean;
};

type StoreTableRowProps = {
  row: StoreProps;
  selected: boolean;
  onSelectRow: () => void;
  onDelete?: (id: string) => void;
};

export function StoreTableRow({ row, selected, onSelectRow, onDelete }: StoreTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(row.id);
    }
    handleClosePopover();
  }, [onDelete, row.id, handleClosePopover]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        {/* Website */}
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row.logo} />
            <Box>
              <Typography variant="body2" noWrap fontWeight="bold">
                {row.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {row.url}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        {/* Platform */}
        <TableCell>
          <Typography variant="body2">
            {row.platform || '-'}
          </Typography>
        </TableCell>

        {/* Business */}
        <TableCell>
          <Typography variant="body2">
            {row.business || '-'}
          </Typography>
        </TableCell>

        {/* Creation Date */}
        <TableCell>
          <Typography variant="body2">
            {row.creationDate ? fDate(row.creationDate) : '-'}
          </Typography>
        </TableCell>

        {/* Articles */}
        <TableCell align="center">
          <Typography variant="body2">
            {row.articlesCount}
          </Typography>
        </TableCell>

        {/* Status */}
        <TableCell>
          {row.isConnected ? (
            <Label color="success">Connected</Label>
          ) : (
            <Button 
              size="small" 
              variant="outlined" 
              color="primary"
              sx={{ borderRadius: 1 }}
            >
              Connect
            </Button>
          )}
        </TableCell>

        {/* Actions */}
        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              borderRadius: 0.5,
            },
          }}
        >
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
