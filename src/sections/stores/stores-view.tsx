import { Trash2 } from "lucide-react";
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react'
import { useNavigate } from "react-router-dom";

import { Box, Grid, Card, Table, Paper, Alert, Avatar, Button, Select ,
  TableRow,
  MenuItem,
  Snackbar,
  TableBody,
  TableCell,
  TableHead,
  Container,
  TextField,
  IconButton,
  Typography,
  Pagination,
  TableContainer,
  InputAdornment,
} from "@mui/material";

import { Iconify } from 'src/components/iconify'

import AddStoreModal from './add-store-modal';

interface Store {
  id: string
  name: string
  url: string
  logo: string
  isConnected: boolean
  articlesCount: number
  lastUpdated: string
  performance: {
    visitors: number
    sales: number
    revenue: number
  }
  articles_list: {
    id: string
    title: string
    description: string
    publishedDate: string
    readTime: string
    views: number
  }[],
  platform?: string
  business?: string
  creationDate?: string
}

const demoStores: Store[] = [
  {
    id: "1",
    name: "WordPress",
    url: "https://itclevers.com",
    logo: "/placeholder.svg",
    isConnected: true,
    articlesCount: 42,
    lastUpdated: "2023-05-15",
    performance: {
      visitors: 15000,
      sales: 500,
      revenue: 25000,
    },
    business : "Technology",
    creationDate : "2025-02-02",
    platform : "WordPress",
    articles_list: [
      {
        id: "1",
        title: "10 Must-Have WordPress Plugins for 2023",
        description: "Discover the essential plugins that will enhance your WordPress site...",
        publishedDate: "2023-05-10",
        readTime: "8 min read",
        views: 1200,
      },
    ],
  },
  {
    id: "2",
    name: "WordPress",
    url: "https://itclevers.com",
    logo: "/placeholder.svg",
    isConnected: true,
    articlesCount: 42,
    lastUpdated: "2023-05-15",
    performance: {
      visitors: 15000,
      sales: 500,
      revenue: 25000,
    },
    business : "Technology",
    creationDate : "2025-02-02",
    platform : "WordPress",
    articles_list: [
      {
        id: "1",
        title: "10 Must-Have WordPress Plugins for 2023",
        description: "Discover the essential plugins that will enhance your WordPress site...",
        publishedDate: "2023-05-10",
        readTime: "8 min read",
        views: 1200,
      },
    ],
  },
]

export function StoresView() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort)
  }, [])

  const handleDelete = useCallback((id: string) => {
    // Handle store deletion logic
    console.log('Deleting store with ID:', id);
  }, [])

  const handleAddStoreSuccess = useCallback(() => {
    enqueueSnackbar('Store connected successfully!', { 
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'center' }
    });
  }, [enqueueSnackbar]);

  const filteredStores = demoStores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedStore) {
    return (
      <Container>
        <Button 
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} 
          onClick={() => setSelectedStore(null)}
          sx={{ mb: 3 }}
        >
          Back to Stores
        </Button>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={selectedStore.logo} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography variant="h6">{selectedStore.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedStore.url}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {[
            { label: 'Articles', value: selectedStore.articlesCount, icon: 'ion:document-text' },
            { label: 'Visitors', value: selectedStore.performance.visitors.toLocaleString(), icon: 'ion:eye' },
            { label: 'Revenue', value: `$${selectedStore.performance.revenue.toLocaleString()}`, icon: 'ion:trending-up' }
          ].map((stat, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Iconify icon={stat.icon} width={24} height={24} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                    <Typography variant="h6">{stat.value}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Generated Articles</Typography>
          <Grid container spacing={2}>
            {selectedStore.articles_list.map(article => (
              <Grid item xs={12} key={article.id}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1">{article.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Published: {article.publishedDate} | {article.readTime}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Iconify icon="ion:eye" width={20} />
                      <Typography>{article.views.toLocaleString()}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Container>
    )
  }

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Your Stores</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => {
            navigate("/stores/add")
          }}
        >
          New Store
        </Button>
      </Box>

      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search stores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
        />

        <Select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="latest">Latest</MenuItem>
          <MenuItem value="articles">Most Articles</MenuItem>
          <MenuItem value="revenue">Most Revenue</MenuItem>
        </Select>

        <Box>
          <IconButton onClick={() => setViewMode('grid')} color={viewMode === 'grid' ? 'primary' : 'default'}>
            <Iconify icon="ion:grid" />
          </IconButton>
          <IconButton onClick={() => setViewMode('list')} color={viewMode === 'list' ? 'primary' : 'default'}>
            <Iconify icon="ion:list" />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Website</strong></TableCell>
            <TableCell><strong>Platform</strong></TableCell>
            <TableCell><strong>Business</strong></TableCell>
            <TableCell><strong>Creation Date</strong></TableCell>
            <TableCell><strong>Articles</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStores.map((store) => (
            <TableRow key={store.id}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar src={store.logo} alt={store.name} />
                  <div>
                    <p>{store.name}</p>
                    <p style={{ color: "gray", fontSize: "0.875rem" }}>{store.url}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{store.platform}</TableCell>
              <TableCell>{store.business}</TableCell>
              <TableCell>{store.creationDate}</TableCell>
              <TableCell>{store.articlesCount}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color={store.isConnected ? "success" : "error"}
                >
                  {store.isConnected ? "Connected" : "Connect"}
                </Button>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(store.id)} color="error">
                  <Trash2 />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination count={10} color="primary" />
      </Box>

      <AddStoreModal
        open={isAddStoreModalOpen}
        onClose={() => setIsAddStoreModalOpen(false)}
        onSuccess={handleAddStoreSuccess}
      />

      <Snackbar 
          open={isAddStoreModalOpen} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
        >
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            Store connected successfully!
          </Alert>
        </Snackbar>
    </Container>
  )
}