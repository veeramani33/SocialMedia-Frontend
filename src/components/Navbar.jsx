import React, { useState, useEffect } from "react";
import { AppBar, Avatar, Badge, Box, InputBase, Menu, MenuItem, styled, Toolbar, Typography, Dialog } from "@mui/material";
import { Mail, Notifications, Pets } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../features/auth/authSlice"; // Adjust the path if necessary
import UserSearch from "../features/users/SearchUser"; // Import the UserSearch component
import EditUser from "../features/users/EditUser";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Search = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: theme.shape.borderRadius,
  width: "40%",
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userID, setUserID] = useState(null);

  const handleLogout = () => {
    dispatch(logOut()); // Clear authentication state
    setOpen(false); // Close the menu
    navigate("/"); // Redirect to the Login page
  };

  // State to control the visibility of EditUser dialog
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);

  const handleOpenEditUserDialog = () => setOpenEditUserDialog(true); // Open EditUser Dialog
  const handleCloseEditUserDialog = () => setOpenEditUserDialog(false); // Close EditUser Dialog
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        setUserID(userId);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);


  if (!userID) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Typography variant="h6">Loading...</Typography>
        </Box>
      );
    }

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          Social Media
        </Typography>
        <Pets sx={{ display: { xs: "block", sm: "none" } }} />
        {/* Include UserSearch component in the Search section <Search>*/}
        <UserSearch /> 
        <Icons>
          <Avatar
            sx={{ width: 30, height: 30 }}
            src='/upload/instagram.png'
            onClick={() => setOpen(true)}
          />
        </Icons>
        
        <UserBox onClick={() => setOpen(true)}>
          <Avatar
            sx={{ width: 30, height: 30 }}
            src="/upload/user.png"
          />
        </UserBox>
      </StyledToolbar>
      
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOpenEditUserDialog}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      {/* Dialog for EditUser */}
      <Dialog open={openEditUserDialog} onClose={handleCloseEditUserDialog} fullWidth>
        <Box p={3}>
          <EditUser userId={userID} /> {/* Pass user data to EditUser */}
        </Box>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
