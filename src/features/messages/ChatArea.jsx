import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useGetMessagesQuery, useSendMessageMutation } from './messageApiSlice';

const ChatArea = ({ userId, friendId }) => {
  const { data: messages, isLoading, isError } = useGetMessagesQuery({ userId, friendId });
  const [sendMessage] = useSendMessageMutation();
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async () => {
    if (messageContent.trim()) {
      await sendMessage({
        senderId: userId,
        receiverId: friendId,
        content: messageContent,
      });
      setMessageContent(''); // Clear the message input after sending
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>Error loading messages</Typography>;
  }

  const noMessages = !messages?.length;

  return (
    <Box>
      <Typography variant="h6" mb={2}>Chat with Friend</Typography>

      {/* If there are no messages, show a message indicating that */}
      {noMessages ? (
        <Typography variant="body2" color="textSecondary" mb={2}>
          No previous messages found. Feel free to start the conversation!
        </Typography>
      ) : (
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            height: '400px',
            overflowY: 'scroll',
          }}
        >
          <List>
            {messages?.map((message) => (
              <ListItem key={message.id}>
                <ListItemText
                  primary={message.senderId === userId ? 'You' : 'Friend'}
                  secondary={message.content}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Input area for sending a message */}
      <Box mt={2} display="flex" alignItems="center">
        <TextField
          variant="outlined"
          fullWidth
          label="Type a message"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 2 }} disabled={!messageContent.trim()}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatArea;
