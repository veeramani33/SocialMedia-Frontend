import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useUpdateUserMutation } from '../features/user/UserApiSlice'; // Assuming you have this hook created

const EditUserDetails = ({ userId, currentUserDetails }) => {
  const [username, setUsername] = useState(currentUserDetails.username || '');
  const [email, setEmail] = useState(currentUserDetails.email || '');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(currentUserDetails.profilePicture || '');
  const [error, setError] = useState('');
  const [updateUser, { isLoading, isError, error: updateError }] = useUpdateUserMutation(); // Using the updateUser mutation hook

  useEffect(() => {
    if (isError && updateError?.data?.message) {
      setError(updateError?.data?.message);
    }
  }, [isError, updateError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUserData = {
      id: userId,
      username,
      email,
      password,
      profilePicture,
    };

    try {
      await updateUser(updatedUserData).unwrap();
      setError('');
      alert('User details updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user details');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Setting base64 string as the profile picture
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
      <Typography variant="h4" gutterBottom>Edit User Details</Typography>

      {error && <Typography color="error" variant="body1">{error}</Typography>}

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        
        <Button
          variant="contained"
          component="label"
          fullWidth
          margin="normal"
        >
          Upload Profile Picture
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {profilePicture && <img src={profilePicture} alt="Profile" width="100" height="100" style={{ marginTop: 10 }} />}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ marginTop: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Update Details'}
        </Button>
      </form>
    </Box>
  );
};

export default EditUserDetails;
