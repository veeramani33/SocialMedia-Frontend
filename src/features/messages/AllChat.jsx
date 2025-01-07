import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider, TextField } from '@mui/material';
import { useGetUserDetailsQuery } from '../users/usersApiSlice';  // Assuming the slice is imported correctly
import { useSendMessageMutation, useGetMessagesQuery } from './messageApiSlice';
import ChatWithFriend from './ChatArea'; // Reuse the ChatWithFriend component for individual chats

const AllFriendsChat = ({ userId }) => {
  const { data: user, isLoading, isError } = useGetUserDetailsQuery(userId);
  const [sendMessage] = useSendMessageMutation();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async (receiverId) => {
    if (messageContent.trim()) {
      await sendMessage({
        senderId: userId,
        receiverId: receiverId,
        content: messageContent,
      });
      setMessageContent(''); // Clear the message input after sending
    }
  };
  
   // Fetch messages between the user and the selected friend
   const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery(
    { userId, friendId: selectedFriend },
    { skip: !selectedFriend } // Skip fetching if no friend is selected
  );
  console.log('Messages:', messages);
  const handleSelectFriend = (friendId) => {
    setSelectedFriend(friendId);
  };

  if (isLoading) {
    return <Typography>Loading user data...</Typography>;
  }

  if (isError || !user) {
    return <Typography>Error loading user data</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>All Friends Chat</Typography>

      {/* Display list of friends */}
      <Box>
        {user.friends && user.friends.length > 0 ? (
          user.friends.map((friend) => (
            <Box key={friend._id} display="flex" alignItems="center" my={2}>
              <Typography variant="body1">{friend.name}</Typography>
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={() => handleSelectFriend(friend._id)}
              >
                Open Chat
              </Button>
            </Box>
          ))
        ) : (
          <Typography>No friends added yet.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Input area for sending a message to selected friend */}
      {/* Chat Box */}
      {selectedFriend ? (
        <Box>
          <Typography variant="h6" mb={2}>
            Chat with {user.friends.find(friend => friend._id === selectedFriend)?.name}
          </Typography>

          {/* Display previous messages */}
          <Box
            sx={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                height: '400px',
                overflowY: 'scroll',
            }}
            >
            {isMessagesLoading ? (
                <Typography>Loading messages...</Typography>
                ) : (
                messages.length > 0 ? (
                    messages.map((message) => (
                    <Box key={message.id} mb={2}> {/* Use id for key */}
                        <Typography variant="body2" color={message.sender === userId ? 'primary' : 'textSecondary'}>
                        {message.sender === userId ? 'You' : 'Friend'}:
                        </Typography>
                        <Typography variant="body1">{message.content}</Typography>
                    </Box>
                    ))
                ) : (
                    <Typography>No messages yet.</Typography>
                )
                )}

            </Box>


          {/* Message Input */}
          <Box mt={2} display="flex" alignItems="center">
            <TextField
              variant="outlined"
              fullWidth
              label="Type a message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => handleSendMessage(selectedFriend)}
              sx={{ ml: 2 }}
              disabled={!messageContent.trim()}
            >
              Send
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography>Select a friend to start chatting.</Typography>
      )}
    </Box>
  );
};

export default AllFriendsChat;



           /* {/* Display messages with the selected friend 
                 <ChatWithFriend userId={userId} friendId={selectedFriend} />
            } 
            */