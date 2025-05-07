import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';
import PropTypes from 'prop-types';

const ChatbotDialog = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Need Assistance? Just Ask!...',
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    console.log('User Message:', currentMessage); 

    // Add the user's message to the chat
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, { role: 'user', content: currentMessage }];
      console.log('Updated Messages After Adding User:', updatedMessages); // Debugging
      return updatedMessages;
    });

    setCurrentMessage(''); 
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentMessage }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      await reader.read().then(function processText({ done, value }) {
        if (done) {
          return Promise.resolve(); // Explicitly return a resolved Promise
        }
      
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
      
        try {
          const jsonResponse = JSON.parse(text);
          if (jsonResponse.data) {
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, { role: 'assistant', content: jsonResponse.data }];
              console.log('Updated Messages After Adding Assistant:', updatedMessages); // Debugging
              return updatedMessages;
            });
          }
        } catch (error) {
          console.error('Error parsing response:', error);
        }
      
        return reader.read().then(processText); // Consistent return
      });      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          height: '80vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>Chat with Tutorly&apos;s Assistant</DialogTitle>
      <DialogContent
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            maxHeight: 'calc(100% - 120px)',
            p: 2,
            border: '1px solid black',
            borderRadius: '10px',
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
              alignItems="center"
              sx={{ width: '100%' }}
            >
              {msg.role === 'assistant' && (
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 32,
                    height: 32,
                    mr: 1,
                  }}
                >
                  <SmartToy fontSize="small" />
                </Avatar>
              )}
              <Typography
                variant="body1"
                sx={{
                  bgcolor: msg.role === 'assistant' ? 'primary.main' : 'info.main',
                  color: msg.role === 'assistant' ? '#000000' : '#ffffff',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </Typography>
            </Box>
          ))}
          {isTyping && (
            <Box display="flex" alignItems="center" sx={{ width: '100%', mt: 1 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 32,
                  height: 32,
                  mr: 1,
                }}
              >
                <SmartToy fontSize="small" />
              </Avatar>
              <Typography variant="body1">
                Typing
                <span className="dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </Typography>
              <style>
                {`
                  .dots span {
                    animation: blink 1.5s infinite;
                    display: inline-block;
                  }
                  .dots span:nth-child(1) {
                    animation-delay: 0s;
                  }
                  .dots span:nth-child(2) {
                    animation-delay: 0.3s;
                  }
                  .dots span:nth-child(3) {
                    animation-delay: 0.6s;
                  }
                  @keyframes blink {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                  }
                `}
              </style>
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={2} mt={2} alignItems="center">
          <TextField
            label="Type your message..."
            fullWidth
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            variant="outlined"
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            sx={{ bgcolor: 'primary.main', color: 'white' }}
          >
            <Send />
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

ChatbotDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatbotDialog;

