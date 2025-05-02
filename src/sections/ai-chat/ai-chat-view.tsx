import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Paper,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatFormValues {
  message: string;
}

export function AIChatView() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: t('ai_chat.welcome_message', 'Hello! I\'m your AI assistant. How can I help you today?'),
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<ChatFormValues>({
    defaultValues: {
      message: '',
    },
  });

  const handleSendMessage = (data: ChatFormValues) => {
    if (!data.message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: data.message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    reset();
    
    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: t('ai_chat.sample_response', 'I\'m currently in development. Soon I\'ll be able to help you with content creation, SEO optimization, and more!'),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
  <DashboardContent>
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('ai_chat.title', 'AI Assistance Chat')}
      </Typography>
      
      <Card sx={{ p: 3, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 2,
            p: 1
          }}
        >
          {messages.map((message) => (
            <Paper
              key={message.id}
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '80%',
                borderRadius: 2,
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                bgcolor: message.sender === 'user' 
                  ? theme.palette.primary.light 
                  : theme.palette.background.neutral,
                color: message.sender === 'user' 
                  ? theme.palette.primary.contrastText 
                  : theme.palette.text.primary,
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
            </Paper>
          ))}
          
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, alignSelf: 'flex-start' }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                {t('ai_chat.typing', 'AI is typing...')}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box component="form" onSubmit={handleSubmit(handleSendMessage)}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder={t('ai_chat.message_placeholder', 'Type your message here...')}
                  variant="outlined"
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                        color="primary" 
                        type="submit" 
                        disabled={isLoading || !field.value.trim()}
                      >
                        <Iconify icon="mdi:send" width={24} />
                      </IconButton>
                    ),
                  }}
                />
              )}
            />
          </Stack>
        </Box>
      </Card>
    </Container>
  </DashboardContent>
  );
}
