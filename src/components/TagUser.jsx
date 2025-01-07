import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useGetUsersQuery } from "../features/users/usersApiSlice";

const TagUser = ({ onAddTag }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users, isLoading, error } = useGetUsersQuery();

  // Log the users data to verify the structure
  console.log("Users data:", users);

  // Check if data exists and has the expected structure
  const userArray = users?.ids?.map((id) => users.entities[id]) || [];

  // Filter users by search term
  const filteredUsers = userArray.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">Failed to load users</Typography>;

  return (
    <Box p={2} maxWidth={400} bgcolor={"background.default"} color={"text.primary"} borderRadius={5}>
      <Typography variant="h6" color="gray" textAlign="center" mb={2}>
        Tag Users
      </Typography>
      <TextField
        fullWidth
        placeholder="Search by username"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List>
        {filteredUsers.map((user) => (
          <ListItem key={user.id} sx={{ display: "flex", alignItems: "center" }}>
            <ListItemAvatar>
              <Avatar src={user?.profilePicture || "/default-avatar.png"} />
            </ListItemAvatar>
            <ListItemText primary={user?.name || "Unknown"} />
            <Button
              variant="contained"
              onClick={() => onAddTag(user?.id)}
            >
              Tag
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TagUser;
