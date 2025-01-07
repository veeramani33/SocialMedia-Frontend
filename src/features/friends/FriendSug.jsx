import React from "react";
import { Box, Button, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { useGetNotFriendListQuery, useSendFriendRequestMutation } from "./friendsApiSlice"; // Ensure the correct import

const FriendRequestList = ({ currentUserId }) => {
  // Fetching the list of users who are not in the current user's friend list
  const { data: usersNotInFriendList, isLoading, isError } = useGetNotFriendListQuery(currentUserId);
  
  // Send friend request mutation
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const handleSendRequest = async (recipientId) => {
    try {
      await sendFriendRequest({
        requesterId: currentUserId,
        recipientId,
      }).unwrap();
      console.log("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6">Loading Users...</Typography>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6" color="error">Error loading users.</Typography>
      </Box>
    );
  }

  // If no users are found
  if (!usersNotInFriendList || usersNotInFriendList.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6">No users to send friend requests to.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Users Not In Your Friend List
      </Typography>
      <List>
        {usersNotInFriendList.map((user) => (
          <ListItem key={user._id}>
            <ListItemAvatar>
              <Avatar src={user.profilePicture} alt={user.name} />
            </ListItemAvatar>
            <ListItemText primary={user.name} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSendRequest(user._id)}
            >
              Send Request
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendRequestList;
