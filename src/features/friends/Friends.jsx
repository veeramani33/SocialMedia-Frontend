import React, { useEffect, useState } from 'react';
import { useGetUserDetailsQuery } from '../users/usersApiSlice';
import { Box, Typography, Button } from '@mui/material';
import Messages from '../messages/ChatArea';  // Import Messages component

const Friend = ({ userId }) => {

  const { data, error, isLoading, isError } = useGetUserDetailsQuery(userId);

  const [userDetails, setUserDetails] = useState(null);
  const [showMessages, setShowMessages] = useState(false);  // State to track message view
  const [friendId, setFriendId] = useState(null);  // Store friendId to pass to Messages component

  useEffect(() => {
    if (data) {
      setUserDetails(data);
    }
  }, [data]);

  const handleMessageClick = (friendId) => {
    setFriendId(friendId);  // Set the friendId when the message button is clicked
    setShowMessages(true);   // Display the Messages component
  };

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="h6">Loading...</Typography></Box>;
  }

  if (isError) {
    return <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="h6" color="error">{error?.message || 'Failed to load friends details.'}</Typography></Box>;
  }

  if (!userDetails) {
    return <Box display="flex" justifyContent="center" alignItems="center"><Typography variant="h6" color="textSecondary">No friends.</Typography></Box>;
  }

  const { friends } = userDetails;

  return (
    <Box p={2}>
      <Typography variant="h6">Friends</Typography>
      {friends.length ? (
        <Box>
          {friends.map((friend) => (
            <Box key={friend._id} display="flex" alignItems="center" my={2}>
              <Typography variant="body1">{friend.name}</Typography>
              <Button variant="outlined" sx={{ ml: 2 }} onClick={() => handleMessageClick(friend._id)}>
                Message
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No friends found.</Typography>
      )}

      {/* Conditionally render the Messages component when showMessages is true */}
      {showMessages && friendId && (
        <Messages userId={userId} friendId={friendId} />
      )}
    </Box>
  );
};

export default Friend;
