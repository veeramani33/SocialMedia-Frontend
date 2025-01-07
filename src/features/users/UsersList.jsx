import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Button, Avatar, Typography } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useGetUsersQuery } from './usersApiSlice'; // Import your API query hook
import { useSendFriendRequestMutation } from '../friends/friendsApiSlice'; // For sending friend requests

const UserList = ({currentUserId}) => {
  console.log(currentUserId);
  const { data, isLoading, isError, error } = useGetUsersQuery(); // Get users
  const [sendFriendRequest] = useSendFriendRequestMutation(); // For sending friend requests

  //const userDataString = localStorage.getItem('user');
  //const userData = JSON.parse(userDataString);
  //const currentUserId = userData?.user?.id || null;

  // Display loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" color="textSecondary">Loading Users...</Typography>
      </Box>
    );
  }

  // Display error state
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" color="error">Error loading users: {error?.message}</Typography>
      </Box>
    );
  }

  // If no users found, display a message
  if (!data?.ids?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" color="textSecondary">No users found.</Typography>
      </Box>
    );
  }

  // Function to handle sending a friend request
  const handleSendRequest = async (recipientId) => {
    try {
      const response = await sendFriendRequest({ requesterId: currentUserId, recipientId });
      if (response.error) {
        console.error("Error sending friend request:", response.error.message);
      } else {
        console.log("Friend request sent!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Render users list as friend suggestions
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Friend Suggestions</Typography>
      <List>
        {data.ids.map((userId) => {
          const user = data.entities[userId]; // Access user details by userId
          if (userId === currentUserId) return null; // Don't show the current user

          return (
            <ListItem key={user.id} sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon>
                <Avatar src={user.profilePicture || '/upload/user.png'} alt={user.name} />
              </ListItemIcon>
              <ListItemText primary={user.name} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSendRequest(user.id)}
                startIcon={<PersonAdd />}
              >
                Send Request
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default UserList;
