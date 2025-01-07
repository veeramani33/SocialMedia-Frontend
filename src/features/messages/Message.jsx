import React, { useState, useEffect } from 'react';
import { useGetMessagesQuery, useSendMessageMutation } from './messageApiSlice';
import { TextField, Button, Box, Typography, List, ListItem, Snackbar } from '@mui/material';

const Messages = ({ userId, friendId }) => {
  const [content, setContent] = useState('');
  const [sendMessage] = useSendMessageMutation();
  const { data: messagesData, error, isLoading } = useGetMessagesQuery({ userId, friendId });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSendMessage = async () => {
    if (!content.trim()) {
      return; // Prevent sending empty messages
    }

    try {
      await sendMessage({ senderId: userId, receiverId: friendId, content }).unwrap();
      setContent(''); // Clear the message input after sending
      setSnackbarMessage('Message sent successfully!');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error sending message:', err);
      setSnackbarMessage('Error sending message.');
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (error) {
      setSnackbarMessage('Error fetching messages.');
      setOpenSnackbar(true);
    }
  }, [error]);

  if (isLoading) return <Typography>Loading messages...</Typography>;
  if (!messagesData?.messages?.length) return <Typography>No messages found</Typography>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chat with Friend
      </Typography>

      {/* Message display area */}
      <List>
        {messagesData.messages.map((message) => (
          <ListItem key={message.id} sx={{ paddingLeft: message.sender === userId ? 4 : 0 }}>
            <Box
              sx={{
                backgroundColor: message.sender === userId ? '#cce5ff' : '#f8f9fa',
                padding: 1,
                borderRadius: 2,
                maxWidth: '80%',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2">
                {message.sender === userId ? 'You: ' : 'Friend: '}
                {message.content}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Message input field */}
      <TextField
        label="Type a message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        fullWidth
        disabled={!content.trim()}
      >
        Send Message
      </Button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default Messages;
