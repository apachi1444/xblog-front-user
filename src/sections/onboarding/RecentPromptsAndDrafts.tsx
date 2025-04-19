import React from 'react';

import { Box, Card, Stack, Typography, CardContent } from '@mui/material';

interface Prompt {
  id: string;
  title: string;
  timestamp: string;
}

interface Draft {
  id: string;
  title: string;
  status: string;
}

interface RecentPromptsAndDraftsProps {
  prompts: Prompt[];
  drafts: Draft[];
}

export const RecentPromptsAndDrafts: React.FC<RecentPromptsAndDraftsProps> = ({
  prompts,
  drafts
}) => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your Recent Prompts
      </Typography>
      <Stack spacing={2}>
        {prompts.map(prompt => (
          <Card key={prompt.id} sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="subtitle1">{prompt.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {prompt.timestamp}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Draft Articles
      </Typography>
      <Stack spacing={2}>
        {drafts.map(draft => (
          <Card key={draft.id} sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="subtitle1">{draft.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {draft.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );