import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Switch } from "@mui/material";
import { Person, Group, AccountBox, Notifications, ModeNight, Mail } from "@mui/icons-material";
import { Dialog } from "@mui/material";
import UserList from "../features/friends/Friends"; 
import FriendRequestNotification from '../features/friends/FriendReq';
import FriendRequestList from "../features/friends/FriendSug";
import EditUser from "../features/users/EditUser"; // Import EditUser component
import AllFriendsChat from "../features/messages/AllChat";

const Sidebar = ({ mode, setMode }) => {
  const [openUserList, setOpenUserList] = useState(false);
  const [userID, setUserID] = useState(null);

  // State to control the visibility of EditUser dialog
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        setUserID(userId);
        console.log('check pannu da ingaaa')
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);

  const handleOpenUserList = () => setOpenUserList(true);
  const handleCloseUserList = () => setOpenUserList(false);

  const [openFriendRequests, setOpenFriendRequests] = useState(false);
  const handleOpenFriendRequests = () => setOpenFriendRequests(true);
  const handleCloseFriendRequests = () => setOpenFriendRequests(false);

  const [openFriendSug, setOpenFriendSug] = useState(false);
  const handleOpenFriendSug = () => setOpenFriendSug(true);
  const handleCloseFriendSug = () => setOpenFriendSug(false);

  const handleOpenEditUserDialog = () => setOpenEditUserDialog(true); // Open EditUser Dialog
  const handleCloseEditUserDialog = () => setOpenEditUserDialog(false); // Close EditUser Dialog

  const [openAllFriendChat, setOpenAllFriendChat] = useState(false);
  const handleOpenAllFriendChat = () => setOpenAllFriendChat(true);
  const handleCloseAllFriendChat = () => setOpenAllFriendChat(false);

  if (!userID) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box flex={1} p={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box position="fixed">
        <List>
          {/* Your existing List Items */}

          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenFriendRequests}>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText primary="Request Notification" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenFriendSug}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Friend Suggestions" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenUserList}>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="Friends" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenAllFriendChat}>
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary="Chat" />
            </ListItemButton>
          </ListItem>

          {/* Open EditUser Dialog */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenEditUserDialog}>
              <ListItemIcon>
                <AccountBox />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href="#theme">
              <ListItemIcon>
                <ModeNight />
              </ListItemIcon>
              <Switch onChange={(e) => setMode(mode === "light" ? "dark" : "light")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Dialog for UserList */}
      <Dialog open={openUserList} onClose={handleCloseUserList} fullWidth>
        <Box p={3}>
          <UserList userId={userID}/>
        </Box>
      </Dialog>

      {/* Dialog for FriendRequestNotification */}
      <Dialog open={openFriendRequests} onClose={handleCloseFriendRequests} fullWidth>
        <Box p={3}>
          <FriendRequestNotification currentUserId={userID} />
        </Box>
      </Dialog>

      {/* Dialog for FriendRequestList */}
      <Dialog open={openFriendSug} onClose={handleCloseFriendSug} fullWidth>
        <Box p={3}>
          <FriendRequestList currentUserId={userID} />
        </Box>
      </Dialog>

      {/* Dialog for FriendRequestList */}
      <Dialog open={openAllFriendChat} onClose={handleCloseAllFriendChat} fullWidth>
        <Box p={3}>
          <AllFriendsChat userId={userID} />
        </Box>
      </Dialog>

      {/* Dialog for EditUser */}
      <Dialog open={openEditUserDialog} onClose={handleCloseEditUserDialog} fullWidth>
        <Box p={3}>
          <EditUser userId={userID} /> {/* Pass user data to EditUser */}
        </Box>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
