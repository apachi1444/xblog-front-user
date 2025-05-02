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
  IconButton,
  CircularProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Feature flag to control whether the AI chat is locked or available
const IS_FEATURE_LOCKED = true;

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
  const [notifyRequested, setNotifyRequested] = useState(false);

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

  const handleNotifyMe = () => {
    setNotifyRequested(true);
    // Here you would typically send a request to the server to add the user to a notification list
    setTimeout(() => {
      setNotifyRequested(false);
    }, 3000);
  };

  // Render the locked state UI
  const renderLockedState = () => (
    <Card sx={{ p: 5, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Iconify
            icon="mdi:robot-outline"
            width={80}
            height={80}
            sx={{
              color: 'primary.main',
              opacity: 0.6,
            }}
          />
        </Box>

        <Typography variant="h4" gutterBottom>
          {t('ai_chat.coming_soon', 'Coming Soon!')}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {t('ai_chat.locked_message', 'This feature is currently in development and will be available soon. Stay tuned for updates!')}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
          {t('ai_chat.unlock_message', 'This feature will be available in the next update. Thank you for your patience!')}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon={notifyRequested ? "mdi:check" : "mdi:bell"} />}
          onClick={handleNotifyMe}
          disabled={notifyRequested}
          sx={{ px: 3, py: 1 }}
        >
          {notifyRequested
            ? t('common.success', 'Success!')
            : t('ai_chat.notify_me', 'Notify Me When Available')}
        </Button>
      </Box>
    </Card>
  );

  // Render the active chat UI
  const renderChatUI = () => (
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
  );

  return (
    <DashboardContent>
      <Container maxWidth={false}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t('ai_chat.title', 'AI Assistance Chat')}
        </Typography>

        {IS_FEATURE_LOCKED ? renderLockedState() : renderChatUI()}
      </Container>
    </DashboardContent>
  );
}
