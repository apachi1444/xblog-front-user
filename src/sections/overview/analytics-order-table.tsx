import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    type: string;
    title: string;
    time: string | number | null;
    amount?: number;
    status?: 'active' | 'completed' | 'pending' | 'cancelled';
    description?: string;
    features?: string[];
  }[];
};

export function AnalyticsOrderTable({ title, subheader, list, ...other }: Props) {
  const theme = useTheme();

  // Determine color based on type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order1':
        return theme.palette.primary.main;
      case 'order2':
        return theme.palette.success.main;
      case 'order3':
        return theme.palette.info.main;
      case 'order4':
        return theme.palette.warning.main;
      default:
        return theme.palette.error.main;
    }
  };

  // Determine status color and label
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.success.main; // Default to completed
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Completed';
    }
  };

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      {...other}
      sx={{
        transition: 'all 0.3s ease-in-out',
        boxShadow: isDarkMode ? `0 8px 16px 0 ${alpha(theme.palette.common.black, 0.3)}` : theme.customShadows.card,
        ...(isDarkMode && {
          backgroundImage: 'none',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)'
        })
      }}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{
          '& .MuiCardHeader-title': {
            color: isDarkMode ? theme.palette.grey[100] : 'inherit',
            fontWeight: 600
          },
          '& .MuiCardHeader-subheader': {
            color: isDarkMode ? theme.palette.grey[500] : 'inherit'
          }
        }}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{
                color: isDarkMode ? theme.palette.grey[300] : 'inherit',
                fontWeight: 600,
                borderBottomColor: isDarkMode ? alpha(theme.palette.grey[500], 0.24) : 'inherit'
              }}>
                Transaction
              </TableCell>
              <TableCell sx={{
                color: isDarkMode ? theme.palette.grey[300] : 'inherit',
                fontWeight: 600,
                borderBottomColor: isDarkMode ? alpha(theme.palette.grey[500], 0.24) : 'inherit'
              }}>
                Date
              </TableCell>
              <TableCell align="right" sx={{
                color: isDarkMode ? theme.palette.grey[300] : 'inherit',
                fontWeight: 600,
                borderBottomColor: isDarkMode ? alpha(theme.palette.grey[500], 0.24) : 'inherit'
              }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  transition: 'background-color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: isDarkMode
                      ? alpha(theme.palette.primary.main, 0.08)
                      : alpha(theme.palette.primary.main, 0.04)
                  },
                  borderBottomColor: isDarkMode ? alpha(theme.palette.grey[500], 0.16) : 'inherit'
                }}
              >
                <TableCell
                  sx={{
                    borderLeft: `4px solid ${getTypeColor(item.type)}`,
                    paddingLeft: 2,
                    borderBottomColor: isDarkMode ? alpha(theme.palette.grey[500], 0.16) : 'inherit',
                    color: isDarkMode ? theme.palette.common.white : 'inherit'
                  }}
                >
                  {item.title}
                  {item.description && (
                    <TableCell
                      component="div"
                      sx={{
                        color: isDarkMode ? theme.palette.grey[400] : 'text.secondary',
                        border: 'none',
                        padding: 0,
                        paddingTop: 0.5
                      }}
                    >
                      {item.description}
                    </TableCell>
                  )}
                  {item.amount !== undefined && (
                    <TableCell
                      component="div"
                      sx={{
                        color: isDarkMode ? theme.palette.primary.light : 'primary.main',
                        fontWeight: 'bold',
                        border: 'none',
                        padding: 0,
                        paddingTop: 0.5
                      }}
                    >
                      {fCurrency(item.amount)}
                    </TableCell>
                  )}
                </TableCell>
                <TableCell sx={{
                  borderBottomColor: isDarkMode ? alpha(theme.palette.grey[500], 0.16) : 'inherit',
                  color: isDarkMode ? theme.palette.grey[300] : 'inherit'
                }}>
                  {fDate(item.time)}
                </TableCell>
                <TableCell align="right" sx={{
                  borderBottomColor: isDarkMode ? alpha(theme.palette.grey[500], 0.16) : 'inherit'
                }}>
                  {item.status && (
                    <Chip
                      label={getStatusLabel(item.status)}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.75rem',
                        color: isDarkMode
                          ? alpha(getStatusColor(item.status), 0.9)
                          : getStatusColor(item.status),
                        bgcolor: isDarkMode
                          ? alpha(getStatusColor(item.status), 0.16)
                          : alpha(getStatusColor(item.status), 0.1),
                        borderColor: isDarkMode
                          ? alpha(getStatusColor(item.status), 0.3)
                          : alpha(getStatusColor(item.status), 0.2),
                        '& .MuiChip-label': { px: 1 },
                        boxShadow: isDarkMode
                          ? `0 0 8px ${alpha(getStatusColor(item.status), 0.2)}`
                          : 'none'
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
