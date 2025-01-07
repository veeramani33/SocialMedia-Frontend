import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Avatar,
} from "@mui/material";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "./usersApiSlice"; // Import hooks

const EditUser = ({ userId }) => {
  const { data: user, isLoading, isError } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null); // File for upload
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.user.name || "");
      setEmail(user.user.email || "");
      const imageUrl = user.user.profilePicture.startsWith("http")
        ? user.user.profilePicture
        : `http://localhost:3500/uploads/${user.user.profilePicture}`;
      setProfilePicture(imageUrl);
    }
  }, [user]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result); // Show preview
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async () => {
    try {
      let uploadedImageUrl = profilePicture;

      // Upload the image if a new file is selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await fetch("http://localhost:3500/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (response.ok) {
            uploadedImageUrl = `http://localhost:3500${data.url}`; // Use full URL
          } else {
            throw new Error(data.message || "File upload failed");
          }
        } catch (err) {
          console.error("Error uploading file:", err);
          alert("File upload failed. Please try again.");
        }      
      }

      const updatedUserData = {
        id: user.user._id,
        username: username,
        email,
        password,
        profilePicture: uploadedImageUrl,
      };

      await updateUser(updatedUserData).unwrap();

      setSnackbarMessage("Profile updated successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbarMessage("Error updating profile.");
      setOpenSnackbar(true);
    }
  };

  if (isLoading) {
    return <Typography>Loading user details...</Typography>;
  }

  if (isError || !user) {
    return <Typography>Error fetching user details</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Edit User Profile
      </Typography>

      {/* Display profile picture */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <Avatar sx={{ width: 100, height: 100, marginRight: 2 }} src={profilePicture} alt="Profile Picture"/>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span">
            Upload Profile Picture
          </Button>
        </label>
      </Box>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
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
        color="primary"
        onClick={handleSave}
        fullWidth
        sx={{ marginTop: 2 }}
        disabled={isUpdating}
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </Button>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Box>
  );
};

export default EditUser;
