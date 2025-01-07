import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Button, Typography } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useGetFriendRequestsQuery, useAcceptFriendRequestMutation } from './friendsApiSlice'; // Assuming you have this hook
import UserList from "../users/UsersList"; // Make sure UserList is being imported correctly

const FriendRequestNotification = ({ currentUserId }) => {
  const { data: friendRequests, isLoading, isError } = useGetFriendRequestsQuery(currentUserId);
  const [acceptFriendRequest] = useAcceptFriendRequestMutation(); // Use a mutation for accepting requests

  // Display loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" color="textSecondary">Loading Friend Requests...</Typography>
      </Box>
    );
  }

  // Display error state
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" color="error">Error loading friend requests.</Typography>
      </Box>
    );
  }

  // If no friend requests, display a message
  if (!friendRequests || !friendRequests.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" color="textSecondary">
          No Friend Requests
        </Typography>
      </Box>
    );
  }

  // Function to handle accepting a friend request
  const handleAcceptRequest = async (requesterId) => {
    try {
      const response = await acceptFriendRequest({ requesterId, recipientId: currentUserId });
      if (response.error) {
        console.error("Error accepting friend request:", response.error.message);
      } else {
        console.log("Friend request accepted!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Friend Requests
      </Typography>
      <List>
        {friendRequests.map((request) => (
          <ListItem key={request.id}>
            <ListItemIcon>
              <PersonAdd />
            </ListItemIcon>
            <ListItemText primary={request.requester.username} secondary={`Requesting to be friends`} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAcceptRequest(request.requester._id)}
            >
              Accept
            </Button>
          </ListItem>
        ))}
      </List>

      {/* Displaying Friend Suggestions */}
      <UserList currentUserId={currentUserId} />
    </Box>
  );
};

export default FriendRequestNotification;
