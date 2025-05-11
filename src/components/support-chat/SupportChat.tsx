import type { ChatMessage } from 'src/contexts/SupportChatContext';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState, useEffect } from 'react';

import {
  Box,
  Fab,
  Zoom,
  Fade,
  Paper,
  Badge,
  Slide,
  alpha,
  Avatar,
  Divider,
  useTheme,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { useSupportChat } from 'src/contexts/SupportChatContext';

import { Iconify } from 'src/components/iconify';

// Chat message component
const ChatMessageItem = ({ message }: { message: ChatMessage }) => {
  const theme = useTheme();
  const isSupport = message.sender === 'support';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSupport ? 'row' : 'row-reverse',
        mb: 2,
      }}
    >
      {isSupport && (
        <Avatar
          src="/assets/images/support-avatar.png"
          alt="Support"
          sx={{
            width: 32,
            height: 32,
            mr: 1,
            bgcolor: theme.palette.primary.main,
          }}
        >
          <Iconify icon="mdi:headset" width={20} />
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: '75%',
          p: 1.5,
          borderRadius: 2,
          position: 'relative',
          ...(isSupport
            ? {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.text.primary,
                borderTopLeftRadius: 0,
              }
            : {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderTopRightRadius: 0,
              }),
        }}
      >
        <Typography variant="body2">{message.text}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            color: isSupport ? 'text.secondary' : alpha(theme.palette.primary.contrastText, 0.7),
            textAlign: isSupport ? 'left' : 'right',
          }}
        >
          {format(new Date(message.timestamp), 'HH:mm')}
        </Typography>
      </Box>

      {!isSupport && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            ml: 1,
            bgcolor: theme.palette.secondary.main,
          }}
        >
          <Iconify icon="mdi:account" width={20} />
        </Avatar>
      )}
    </Box>
  );
};

// Main chat component
export const SupportChat = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    isOpen,
    messages,
    unreadCount,
    isVisible,
    closeChat,
    toggleChat,
    sendMessage
  } = useSupportChat();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && messagesEndRef.current && isVisible) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isVisible]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && isVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isVisible]);

  // Don't render anything if the chat shouldn't be visible on this route
  if (!isVisible) {
    return null;
  }

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  // Handle key down (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Zoom in={!isOpen}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Fab
              color="primary"
              onClick={toggleChat}
              aria-label={t('support.openChat', 'Open support chat')}
              sx={{
                boxShadow: theme.customShadows?.z8,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.customShadows?.z16,
                },
                transition: 'all 0.2s',
              }}
            >
              <Iconify icon="mdi:chat" width={24} />
            </Fab>
          </Badge>
        </Zoom>
      </Box>

      {/* Chat window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 320,
            height: 480,
            borderRadius: 2,
            overflow: 'hidden',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: theme.customShadows?.z16,
          }}
        >
          {/* Chat header */}
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src="/assets/images/support-avatar.png"
                alt="Support"
                sx={{ width: 32, height: 32, mr: 1, bgcolor: alpha(theme.palette.primary.contrastText, 0.2) }}
              >
                <Iconify icon="mdi:headset" width={20} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {t('support.title', 'Customer Support')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {t('support.status', 'Online')}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={closeChat}
              size="small"
              sx={{ color: theme.palette.primary.contrastText }}
            >
              <Iconify icon="mdi:close" width={20} />
            </IconButton>
          </Box>

          {/* Chat messages */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              bgcolor: theme.palette.background.default,
            }}
          >
            {messages.map((message) => (
              <Fade key={message.id} in timeout={500}>
                <Box>
                  <ChatMessageItem message={message} />
                </Box>
              </Fade>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Chat input */}
          <Box
            sx={{
              p: 2,
              bgcolor: theme.palette.background.paper,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('support.inputPlaceholder', 'Type a message...')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
              size="small"
              multiline
              maxRows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              sx={{ ml: 1 }}
            >
              <Iconify icon="mdi:send" width={20} />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};


