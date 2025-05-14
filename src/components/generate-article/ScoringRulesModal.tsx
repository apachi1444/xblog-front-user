import { useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Tab,
  Tabs,
  Chip,
  Modal,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { sectionScores } from 'src/utils/seoScoringPoints';
import { SEO_SCORING_RULES } from 'src/utils/seoScoringRules';

interface ScoringRulesModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScoringRulesModal({ open, onClose }: ScoringRulesModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Get the category weights
  const { weights } = sectionScores;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="scoring-rules-modal-title"
      aria-describedby="scoring-rules-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%', md: '70%' },
          maxWidth: 900,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h6" component="h2" id="scoring-rules-modal-title">
            SEO Scoring Rules
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'primary.contrastText',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scoring rules tabs"
          >
            <Tab label={`Primary SEO (${weights.primarySeo}%)`} />
            <Tab label={`Title Optimization (${weights.titleOptimization}%)`} />
            <Tab label={`Content Presentation (${weights.contentPresentation}%)`} />
            <Tab label={`Additional Factors (${weights.additionalSeoFactors}%)`} />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
          {/* Primary SEO Tab */}
          {activeTab === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Criteria</TableCell>
                    <TableCell>Input Category</TableCell>
                    <TableCell>Max Score</TableCell>
                    <TableCell>Scoring Rules</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SEO_SCORING_RULES.primary_seo.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.input || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{item.max_score}</TableCell>
                      <TableCell>
                        {Object.entries(item.scoring_rules).map(([score, description]) => (
                          <Box key={score} sx={{ mb: 1 }}>
                            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                              {score} points:
                            </Typography>{' '}
                            <Typography variant="body2" component="span">
                              {description}
                            </Typography>
                          </Box>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Title Optimization Tab */}
          {activeTab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Criteria</TableCell>
                    <TableCell>Input Category</TableCell>
                    <TableCell>Max Score</TableCell>
                    <TableCell>Scoring Rules</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SEO_SCORING_RULES.title_optimization.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.input || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{item.max_score}</TableCell>
                      <TableCell>
                        {Object.entries(item.scoring_rules).map(([score, description]) => (
                          <Box key={score} sx={{ mb: 1 }}>
                            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                              {score} points:
                            </Typography>{' '}
                            <Typography variant="body2" component="span">
                              {description}
                            </Typography>
                          </Box>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Content Presentation Tab */}
          {activeTab === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Criteria</TableCell>
                    <TableCell>Input Category</TableCell>
                    <TableCell>Max Score</TableCell>
                    <TableCell>Scoring Rules</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SEO_SCORING_RULES.content_presentation.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.input || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{item.max_score}</TableCell>
                      <TableCell>
                        {Object.entries(item.scoring_rules).map(([score, description]) => (
                          <Box key={score} sx={{ mb: 1 }}>
                            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                              {score} points:
                            </Typography>{' '}
                            <Typography variant="body2" component="span">
                              {description}
                            </Typography>
                          </Box>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Additional SEO Factors Tab */}
          {activeTab === 3 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Criteria</TableCell>
                    <TableCell>Input Category</TableCell>
                    <TableCell>Max Score</TableCell>
                    <TableCell>Scoring Rules</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SEO_SCORING_RULES.additional_seo_factors.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.input || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{item.max_score}</TableCell>
                      <TableCell>
                        {Object.entries(item.scoring_rules).map(([score, description]) => (
                          <Box key={score} sx={{ mb: 1 }}>
                            <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                              {score} points:
                            </Typography>{' '}
                            <Typography variant="body2" component="span">
                              {description}
                            </Typography>
                          </Box>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

// Button component to open the scoring rules modal
export function ScoringRulesButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<InfoIcon />}
        onClick={handleOpen}
        sx={{ ml: 1 }}
      >
        Scoring Rules
      </Button>
      <ScoringRulesModal open={open} onClose={handleClose} />
    </>
  );
}
