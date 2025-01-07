import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserDetailsQuery } from './usersApiSlice';  // Adjust import path if necessary
import { Box, Typography, Button, Divider } from '@mui/material';

const User = () => {
  const { userId } = useParams();  // Retrieve user ID from URL
  const { data, error, isLoading, isError } = useGetUserDetailsQuery(userId);

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (data) {
      setUserDetails(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="error">{error?.message || 'Failed to load user details.'}</Typography>
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h6" color="textSecondary">No user details available.</Typography>
      </Box>
    );
  }

  const { user, posts, messages, friends } = userDetails;

  return (
    <Box p={2}>
      <Typography variant="h4">{user.username}'s Profile</Typography>
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Posts</Typography>
      {posts.length ? (
        posts.map((post) => (
          <Box key={post._id} my={2} p={2} border="1px solid #ccc" borderRadius="4px">
            <Typography variant="body1">{post.content}</Typography>
          </Box>
        ))
      ) : (
        <Typography>No posts found.</Typography>
      )}

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="h6">Messages</Typography>
      {messages.length ? (
        messages.map((message) => (
          <Box key={message._id} my={2} p={2} border="1px solid #ccc" borderRadius="4px">
            <Typography variant="body2">{message.content}</Typography>
          </Box>
        ))
      ) : (
        <Typography>No messages found.</Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Friends</Typography>
      {friends.length ? (
        <Box>
          {friends.map((friend) => (
            <Box key={friend._id} display="flex" alignItems="center" my={2}>
              <Typography variant="body1">{friend.username}</Typography>
              <Button variant="outlined" sx={{ ml: 2 }}>
                Message
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No friends found.</Typography>
      )}

      <Divider sx={{ my: 2 }} />
      
      <Button variant="contained" color="primary" href={`/edit-user/${userId}`}>
        Edit Profile
      </Button>
    </Box>
  );
};

export default User;
